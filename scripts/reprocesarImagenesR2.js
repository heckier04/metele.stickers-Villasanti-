import { S3Client, ListObjectsV2Command, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';
import process from 'process';

const REQUIRED_ENV = ['R2_ENDPOINT', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY', 'R2_BUCKET'];
for (const key of REQUIRED_ENV) {
  if (!process.env[key]) {
    console.error(`ERROR: Falta la variable de entorno ${key}`);
    process.exit(1);
  }
}

const modoConfirmar = process.argv.includes('--confirmar');
const prefijo = process.argv.find((a) => a.startsWith('--prefijo='))?.split('=')[1] || 'productos/';

const s3 = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

// Lee un stream (respuesta de S3) y lo convierte en un buffer completo
async function streamABuffer(stream) {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

async function listarTodosLosObjetos(bucket, prefix) {
  const objetos = [];
  let continuationToken = undefined;

  do {
    const respuesta = await s3.send(
      new ListObjectsV2Command({
        Bucket: bucket,
        Prefix: prefix,
        ContinuationToken: continuationToken,
      })
    );
    for (const obj of respuesta.Contents || []) {
      objetos.push(obj.Key);
    }
    continuationToken = respuesta.NextContinuationToken;
  } while (continuationToken);

  return objetos;
}

async function reprocesarObjeto(key) {
  // 1. Bajar la imagen actual de R2
  const respuesta = await s3.send(
    new GetObjectCommand({ Bucket: process.env.R2_BUCKET, Key: key })
  );
  const bufferOriginal = await streamABuffer(respuesta.Body);
  const pesoOriginal = bufferOriginal.length;

  // 2. Recortar el margen transparente y volver a comprimir
  const bufferProcesado = await sharp(bufferOriginal)
    .trim()
    .webp({ quality: 82 })
    .toBuffer();
  const pesoNuevo = bufferProcesado.length;

  // 3. Subir de nuevo, pisando el mismo archivo (misma key = misma URL)
  if (modoConfirmar) {
    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET,
        Key: key,
        Body: bufferProcesado,
        ContentType: 'image/webp',
      })
    );
  }

  return { pesoOriginal, pesoNuevo };
}

async function main() {
  console.log(modoConfirmar ? '🚀 MODO REAL: se van a reemplazar los archivos en R2.' : '🔍 MODO SIMULACIÓN: no se sube nada todavía.');
  console.log(`Buscando objetos con prefijo "${prefijo}" en el bucket "${process.env.R2_BUCKET}"...\n`);

  const claves = await listarTodosLosObjetos(process.env.R2_BUCKET, prefijo);
  console.log(`Se encontraron ${claves.length} archivos.\n`);

  let procesados = 0;
  let errores = 0;
  let pesoTotalOriginal = 0;
  let pesoTotalNuevo = 0;

  for (const key of claves) {
    try {
      const { pesoOriginal, pesoNuevo } = await reprocesarObjeto(key);
      const cambio = Math.round((1 - pesoNuevo / pesoOriginal) * 100);
      console.log(
        `  ${modoConfirmar ? '✅' : '[SIMULACIÓN]'} ${key} (${(pesoOriginal / 1024).toFixed(0)}KB → ${(pesoNuevo / 1024).toFixed(0)}KB, ${cambio >= 0 ? '-' : '+'}${Math.abs(cambio)}%)`
      );
      procesados++;
      pesoTotalOriginal += pesoOriginal;
      pesoTotalNuevo += pesoNuevo;
    } catch (error) {
      console.error(`  ❌ Error con ${key}:`, error.message);
      errores++;
    }
  }

  console.log(`\nResumen: ${procesados} ${modoConfirmar ? 'reprocesados' : 'listos para reprocesar'}, ${errores} con error.`);
  if (pesoTotalOriginal > 0) {
    console.log(
      `Peso total: ${(pesoTotalOriginal / 1024 / 1024).toFixed(1)}MB → ${(pesoTotalNuevo / 1024 / 1024).toFixed(1)}MB`
    );
  }
  if (!modoConfirmar) {
    console.log('\n👉 Esto fue una simulación (no se subió nada). Si el resultado se ve bien, corré de nuevo agregando --confirmar.');
  }
}

main().catch((error) => {
  console.error('Error general:', error);
  process.exit(1);
});