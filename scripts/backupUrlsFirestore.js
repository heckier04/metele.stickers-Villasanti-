import admin from 'firebase-admin';
import fs from 'fs';
import process from 'process';

// ===== Validación =====
if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.error('ERROR: Define GOOGLE_APPLICATION_CREDENTIALS apuntando al service account JSON.');
  process.exit(1);
}

// ===== Firebase Admin =====
admin.initializeApp({ credential: admin.credential.applicationDefault() });
const db = admin.firestore();

async function backupColeccion(nombreColeccion) {
  const snapshot = await db.collection(nombreColeccion).get();
  const datos = {};

  for (const doc of snapshot.docs) {
    const data = doc.data();
    datos[doc.id] = {
      name: data.name || null,
      img: data.img || null,
    };
  }

  console.log(`"${nombreColeccion}": ${Object.keys(datos).length} documentos guardados.`);
  return datos;
}

async function main() {
  console.log('Leyendo Firestore (no se modifica nada)...\n');

  const backup = {
    fecha: new Date().toISOString(),
    productos: await backupColeccion('productos'),
    packsPorMayor: await backupColeccion('packsPorMayor'),
  };

  const nombreArchivo = `backup-urls-${new Date().toISOString().split('T')[0]}.json`;
  fs.writeFileSync(nombreArchivo, JSON.stringify(backup, null, 2), 'utf-8');

  console.log(`\n✅ Backup guardado en: ${nombreArchivo}`);
  console.log('Este archivo tiene las URLs de Cloudinary de cada producto ANTES de migrar a R2.');
  console.log('Guardalo en un lugar seguro (fuera de la carpeta del proyecto, por las dudas).');

  process.exit(0);
}

main().catch((error) => {
  console.error('Error general:', error);
  process.exit(1);
});