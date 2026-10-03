import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import process from 'process';

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.error('ERROR: Define GOOGLE_APPLICATION_CREDENTIALS apuntando al service account JSON.');
  process.exit(1);
}

const backupFolder = process.argv[2];
if (!backupFolder) {
  console.error('Uso: node scripts/diagnosticoFaltantes.js "C:\\ruta\\al\\backup"');
  process.exit(1);
}
if (!fs.existsSync(backupFolder)) {
  console.error(`ERROR: No existe la carpeta ${backupFolder}`);
  process.exit(1);
}

admin.initializeApp({ credential: admin.credential.applicationDefault() });
const db = admin.firestore();

// ===== Indexar todos los archivos del backup =====
function indexarArchivos(carpeta) {
  const archivos = []; // { nombre, nombreSinExt, ruta }
  const recorrer = (dir) => {
    for (const entrada of fs.readdirSync(dir, { withFileTypes: true })) {
      const rutaCompleta = path.join(dir, entrada.name);
      if (entrada.isDirectory()) {
        recorrer(rutaCompleta);
      } else {
        archivos.push({
          nombre: entrada.name,
          nombreSinExt: entrada.name.replace(/\.[a-z0-9]+$/i, '').toLowerCase(),
          ruta: rutaCompleta,
        });
      }
    }
  };
  recorrer(carpeta);
  return archivos;
}

function extraerNombreArchivo(url) {
  if (!url) return null;
  try {
    const partes = url.split('/');
    const raw = partes[partes.length - 1];
    try {
      return decodeURIComponent(raw);
    } catch {
      return raw;
    }
  } catch {
    return null;
  }
}

// Similaridad simple: cuenta cuántos caracteres en común tienen dos strings
// normalizados (sin tildes, sin guiones bajos, sin mayúsculas).
function normalizar(str) {
  return str
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // saca tildes
    .replace(/[_\-\s]/g, ''); // saca guiones y espacios
}

function similitud(a, b) {
  const na = normalizar(a);
  const nb = normalizar(b);
  if (na === nb) return 1;
  if (na.includes(nb) || nb.includes(na)) return 0.9;
  // Contar caracteres compartidos en orden (LCS simplificado por longitud)
  let comunes = 0;
  const largo = Math.min(na.length, nb.length);
  for (let i = 0; i < largo; i++) {
    if (na[i] === nb[i]) comunes++;
  }
  return comunes / Math.max(na.length, nb.length);
}

async function diagnosticar(nombreColeccion, archivosBackup) {
  console.log(`\n===== Diagnóstico "${nombreColeccion}" =====\n`);
  const snapshot = await db.collection(nombreColeccion).get();

  for (const doc of snapshot.docs) {
    const data = doc.data();
    const urlVieja = data.img;
    if (!urlVieja) continue;

    const nombreArchivo = extraerNombreArchivo(urlVieja);
    const nombreSinExt = nombreArchivo.replace(/\.[a-z0-9]+$/i, '');

    // Si ya migró (URL apunta a R2), lo salteamos
    if (urlVieja.includes('.r2.dev') || urlVieja.includes('r2.cloudflarestorage.com')) {
      continue;
    }

    // Buscar el mejor candidato por similitud
    let mejorCandidato = null;
    let mejorScore = 0;
    for (const archivo of archivosBackup) {
      const score = similitud(nombreSinExt, archivo.nombreSinExt);
      if (score > mejorScore) {
        mejorScore = score;
        mejorCandidato = archivo;
      }
    }

    if (mejorScore >= 0.5) {
      console.log(`  🔶 "${data.name || doc.id}"`);
      console.log(`     Buscaba: "${nombreArchivo}"`);
      console.log(`     Posible match (${Math.round(mejorScore * 100)}%): "${mejorCandidato.nombre}"`);
      console.log('');
    } else {
      console.log(`  ❌ "${data.name || doc.id}" — sin match cercano (buscaba "${nombreArchivo}")`);
    }
  }
}

async function main() {
  console.log(`Indexando archivos en: ${backupFolder}...`);
  const archivosBackup = indexarArchivos(backupFolder);
  console.log(`Se encontraron ${archivosBackup.length} archivos en el backup.`);

  await diagnosticar('productos', archivosBackup);
  await diagnosticar('packsPorMayor', archivosBackup);

  console.log('\n👉 Los marcados con 🔶 tienen un posible match — revisalos a mano.');
  console.log('👉 Los marcados con ❌ probablemente no están en tu backup local (habría que buscarlos en otro lado o subirlos de nuevo).');

  process.exit(0);
}

main().catch((error) => {
  console.error('Error general:', error);
  process.exit(1);
});