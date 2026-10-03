const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ANCHO_MAXIMO = 1920; // ancho normal para un banner de sitio web
const CALIDAD_WEBP = 80;

const carpeta = process.argv[2];

if (!carpeta) {
  console.error('Uso: node comprimirBanners.cjs "C:\\ruta\\a\\la\\carpeta\\de\\banners"');
  process.exit(1);
}

async function main() {
  const archivos = fs
    .readdirSync(carpeta)
    .filter((f) => /\.(jpg|jpeg|png)$/i.test(f));

  console.log(`Encontrados ${archivos.length} banners para comprimir.\n`);

  for (const archivo of archivos) {
    const rutaIn = path.join(carpeta, archivo);
    const bufferOriginal = fs.readFileSync(rutaIn);
    const pesoOriginal = bufferOriginal.length;

    const bufferOptimizado = await sharp(bufferOriginal)
      .resize({ width: ANCHO_MAXIMO, withoutEnlargement: true })
      .webp({ quality: CALIDAD_WEBP })
      .toBuffer();

    const nombreSinExt = path.basename(archivo, path.extname(archivo));
    const rutaOut = path.join(carpeta, `${nombreSinExt}.webp`);
    fs.writeFileSync(rutaOut, bufferOptimizado);

    const pesoNuevo = bufferOptimizado.length;
    console.log(
      `  ✅ ${archivo} (${(pesoOriginal / 1024 / 1024).toFixed(1)}MB) → ${nombreSinExt}.webp (${(pesoNuevo / 1024).toFixed(0)}KB)`
    );
  }

  console.log('\nListo. Subí los .webp a tu carpeta public/ y actualizá las referencias en App.jsx.');
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
