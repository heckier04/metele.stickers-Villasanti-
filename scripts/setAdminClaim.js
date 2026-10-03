/*
Script para asignar custom claim `admin: true` a un usuario de Firebase Auth
Usar desde la raíz del proyecto:

1) Instala dependencias (si no están):
   npm install firebase-admin

2) Exporta la variable de entorno con tu service account JSON (Google Cloud):
   Windows PowerShell:
     $env:GOOGLE_APPLICATION_CREDENTIALS="C:\ruta\a\serviceAccountKey.json"
   macOS / Linux:
     export GOOGLE_APPLICATION_CREDENTIALS="/ruta/a/serviceAccountKey.json"

3) Ejecuta el script con el UID o email del usuario:
   node scripts/setAdminClaim.js --uid=USER_UID
   // o
   node scripts/setAdminClaim.js --email=admin@example.com

*/

import admin from 'firebase-admin';
import minimist from 'minimist';
import process from 'process';

const argv = minimist(process.argv.slice(2));

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.error('ERROR: Define GOOGLE_APPLICATION_CREDENTIALS apuntando al service account JSON.');
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

async function main() {
  try {
    let userRecord;

    if (argv.uid) {
      userRecord = await admin.auth().getUser(argv.uid);
    } else if (argv.email) {
      userRecord = await admin.auth().getUserByEmail(argv.email);
    } else {
      console.error('Proporciona --uid=USER_UID o --email=admin@example.com');
      process.exit(1);
    }

    console.log('Usuario encontrado:', userRecord.uid, userRecord.email);

    await admin.auth().setCustomUserClaims(userRecord.uid, { admin: true });

    console.log('Claim `admin: true` asignado a', userRecord.uid);

    // Opcional: forzar refresh del token (manual): el usuario deberá volver a iniciar sesión
    process.exit(0);
  } catch (error) {
    console.error('Error asignando claim:', error);
    process.exit(1);
  }
}

main();
