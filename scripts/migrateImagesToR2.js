/*
Script para migrar imágenes de Cloudinary (cuenta cerrada) a Cloudflare R2,
usando tu backup local como fuente de los archivos.

QUÉ HACE:
1. Lee cada documento de las colecciones "productos" y "packsPorMayor" en Firestore
2. Extrae el nombre de archivo de la URL vieja de Cloudinary (ej: "Ruta_40_gihn6z.png")
3. Busca ese archivo dentro de tu carpeta de backup local (recursivo, en subcarpetas)
4. Si lo encuentra, lo sube a tu bucket de R2
5. Actualiza el campo "img" en Firestore con la nueva URL pública de R2

MODO SEGURO POR DEFECTO:
Corre en modo SIMULACIÓN (no sube nada, no escribe nada en Firestore) a menos
que le pases el flag --confirmar. Corré primero sin el flag para revisar el
reporte, y recién después con --confirmar para ejecutar de verdad.

CÓMO USARLO:

1) Instalá dependencias (desde la raíz del proyecto):
   npm install firebase-admin @aws-sdk/client-s3

2) Configurá las variables de entorno (PowerShell, en la misma terminal donde
   vas a correr el script):
   $env:GOOGLE_APPLICATION_CREDENTIALS="C:\Users\thiag\stickers web\metele-stickerss-firebase-adminsdk-fbsvc-32de81f322.json"
   $env:R2_ENDPOINT="https://7ee22870417e5a66967afcb5e9d70d3c.r2.cloudflarestorage.com"
   $env:R2_ACCESS_KEY_ID="476a1fde9c7ac9ac75c77db7ec99e341"
   $env:R2_SECRET_ACCESS_KEY="354d6f4030de22fac27dc0abc4577a39c139069fd3355c2e6c31ce056631035e"
   $env:R2_BUCKET="metele-stickers"
   $env:R2_PUBLIC_URL="https://pub-de3e132d5b9d43bf90571fc35c853838.r2.dev"

3) Corré en modo simulación primero (sin --confirmar):
   node scripts/migrateImagesToR2.js "C:\ruta\a\tu\carpeta\de\backup"

4) Si el reporte se ve bien, corré de verdad:
   node scripts/migrateImagesToR2.js "C:\ruta\a\tu\carpeta\de\backup" --confirmar
*/
import admin from 'firebase-admin';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import process from 'process';
 
// Ancho máximo en px. Tus imágenes nunca se muestran más grandes que esto
// en ningún lugar del sitio, así que no tiene sentido guardarlas más pesadas.
const ANCHO_MAXIMO = 800;
const CALIDAD_WEBP = 82;
 
// ===== Validaciones de entorno =====
const REQUIRED_ENV = ['R2_ENDPOINT', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY', 'R2_BUCKET', 'R2_PUBLIC_URL'];
for (const key of REQUIRED_ENV) {
  if (!process.env[key]) {
    console.error(`ERROR: Falta la variable de entorno ${key}`);
    process.exit(1);
  }
}
if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.error('ERROR: Define GOOGLE_APPLICATION_CREDENTIALS apuntando al service account JSON.');
  process.exit(1);
}
 
const backupFolder = process.argv[2];
const modoConfirmar = process.argv.includes('--confirmar');
 
if (!backupFolder) {
  console.error('Uso: node scripts/migrateImagesToR2.js "C:\\ruta\\al\\backup" [--confirmar]');
  process.exit(1);
}
if (!fs.existsSync(backupFolder)) {
  console.error(`ERROR: No existe la carpeta ${backupFolder}`);
  process.exit(1);
}
 
// ===== Firebase Admin =====
admin.initializeApp({ credential: admin.credential.applicationDefault() });
const db = admin.firestore();
 
// ===== Cliente de R2 (compatible con S3) =====
const s3 = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});
 
// ===== Indexar todos los archivos del backup por nombre =====
function indexarArchivos(carpeta) {
  const indice = new Map(); // nombre de archivo (lowercase) -> ruta completa
  const recorrer = (dir) => {
    for (const entrada of fs.readdirSync(dir, { withFileTypes: true })) {
      const rutaCompleta = path.join(dir, entrada.name);
      if (entrada.isDirectory()) {
        recorrer(rutaCompleta);
      } else {
        indice.set(entrada.name.toLowerCase(), rutaCompleta);
      }
    }
  };
  recorrer(carpeta);
  return indice;
}
 
function extraerNombreArchivo(url) {
  if (!url) return null;
  try {
    const partes = url.split('/');
    const raw = partes[partes.length - 1];
    try {
      // Las URLs de Cloudinary codifican tildes/ñ como %C3%B1, etc.
      // Los archivos reales del backup tienen el nombre "normal", sin codificar.
      return decodeURIComponent(raw);
    } catch {
      return raw;
    }
  } catch {
    return null;
  }
}
 
function buscarEnIndice(nombreArchivo, indiceArchivos) {
  if (!nombreArchivo) return null;
  const nombreLower = nombreArchivo.toLowerCase();
 
  // 1. Coincidencia exacta
  if (indiceArchivos.has(nombreLower)) {
    return { ruta: indiceArchivos.get(nombreLower), nombreFinal: nombreArchivo };
  }
 
  // 2. Mismo nombre base con otra extensión
  // (ej: la URL vieja dice ".heic" pero en el backup quedó como ".jpg" o ".png")
  const sinExtension = nombreLower.replace(/\.[a-z0-9]+$/i, '');
  const extensionesAlternativas = ['.jpg', '.jpeg', '.png', '.webp', '.heic'];
  for (const ext of extensionesAlternativas) {
    const candidato = sinExtension + ext;
    if (indiceArchivos.has(candidato)) {
      return { ruta: indiceArchivos.get(candidato), nombreFinal: sinExtension.split('/').pop() + ext };
    }
  }
 
  return null;
}
 
async function subirArchivo(rutaLocal, nombreDestinoSinExt) {
  const bufferOriginal = fs.readFileSync(rutaLocal);
  const pesoOriginal = bufferOriginal.length;
 
  // Recorta el margen transparente/uniforme sobrante alrededor del sticker
  // (muchos PNG exportados de Canva tienen un "lienzo" más grande que el dibujo real),
  // redimensiona (sin agrandar imágenes ya chicas) y convierte a WebP,
  // mucho más liviano que PNG/JPG con la misma calidad visual.
  const bufferOptimizado = await sharp(bufferOriginal)
    .trim()
    .resize({ width: ANCHO_MAXIMO, withoutEnlargement: true })
    .webp({ quality: CALIDAD_WEBP })
    .toBuffer();
 
  const nombreDestino = `${nombreDestinoSinExt}.webp`;
 
  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET,
      Key: nombreDestino,
      Body: bufferOptimizado,
      ContentType: 'image/webp',
    })
  );
 
  return {
    url: `${process.env.R2_PUBLIC_URL}/${nombreDestino}`,
    pesoOriginal,
    pesoOptimizado: bufferOptimizado.length,
  };
}
 
async function migrarColeccion(nombreColeccion, prefijoDestino, indiceArchivos) {
  console.log(`\n===== Procesando colección "${nombreColeccion}" =====`);
 
  const snapshot = await db.collection(nombreColeccion).get();
  let migrados = 0;
  let noEncontrados = 0;
  let sinImagen = 0;
  let pesoTotalOriginal = 0;
  let pesoTotalOptimizado = 0;
 
  for (const doc of snapshot.docs) {
    const data = doc.data();
    const urlVieja = data.img;
 
    if (!urlVieja) {
      sinImagen++;
      continue;
    }
 
    const nombreArchivo = extraerNombreArchivo(urlVieja);
    const encontrado = buscarEnIndice(nombreArchivo, indiceArchivos);
 
    if (!encontrado) {
      console.log(`  ⚠️  No encontrado en el backup: "${data.name || doc.id}" (buscaba "${nombreArchivo}")`);
      noEncontrados++;
      continue;
    }
 
    const rutaLocal = encontrado.ruta;
    // Le sacamos la extensión vieja al nombre de destino, porque subirArchivo
    // siempre termina agregando ".webp" (la imagen se convierte a ese formato).
    const nombreSinExt = encontrado.nombreFinal.replace(/\.[a-z0-9]+$/i, '');
    const nombreDestinoSinExt = `${prefijoDestino}/${nombreSinExt}`;
 
    if (modoConfirmar) {
      try {
        const { url: nuevaUrl, pesoOriginal, pesoOptimizado } = await subirArchivo(rutaLocal, nombreDestinoSinExt);
        await doc.ref.update({ img: nuevaUrl });
        const ahorro = Math.round((1 - pesoOptimizado / pesoOriginal) * 100);
        console.log(
          `  ✅ "${data.name || doc.id}" → ${nuevaUrl} (${(pesoOriginal / 1024).toFixed(0)}KB → ${(pesoOptimizado / 1024).toFixed(0)}KB, -${ahorro}%)`
        );
        migrados++;
        pesoTotalOriginal += pesoOriginal;
        pesoTotalOptimizado += pesoOptimizado;
      } catch (error) {
        console.error(`  ❌ Error con "${data.name || doc.id}":`, error.message);
      }
    } else {
      console.log(`  [SIMULACIÓN] "${data.name || doc.id}" → subiría ${rutaLocal} como ${nombreDestinoSinExt}.webp (comprimida)`);
      migrados++;
    }
  }
 
  console.log(`\nResumen "${nombreColeccion}": ${migrados} ${modoConfirmar ? 'migrados' : 'listos para migrar'}, ${noEncontrados} no encontrados en el backup, ${sinImagen} sin imagen.`);
  if (modoConfirmar && pesoTotalOriginal > 0) {
    const ahorroTotal = Math.round((1 - pesoTotalOptimizado / pesoTotalOriginal) * 100);
    console.log(
      `Peso total: ${(pesoTotalOriginal / 1024 / 1024).toFixed(1)}MB → ${(pesoTotalOptimizado / 1024 / 1024).toFixed(1)}MB (ahorro del ${ahorroTotal}%)`
    );
  }
}
 
async function main() {
  console.log(modoConfirmar ? '🚀 MODO REAL: se va a escribir en Firestore y subir a R2.' : '🔍 MODO SIMULACIÓN: no se sube ni escribe nada todavía.');
  console.log(`Indexando archivos en: ${backupFolder}...`);
 
  const indiceArchivos = indexarArchivos(backupFolder);
  console.log(`Se encontraron ${indiceArchivos.size} archivos en el backup.\n`);
 
  await migrarColeccion('productos', 'productos', indiceArchivos);
  await migrarColeccion('packsPorMayor', 'packs', indiceArchivos);
 
  if (!modoConfirmar) {
    console.log('\n👉 Esto fue una simulación. Si el resultado se ve bien, corré de nuevo agregando --confirmar al final.');
  }
 
  process.exit(0);
}
 
main().catch((error) => {
  console.error('Error general:', error);
  process.exit(1);
});
 