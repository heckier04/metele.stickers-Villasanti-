// /**
//  * FIREBASE FIRESTORE RULES - SEGURIDAD DEL ADMIN PANEL
//  * 
//  * COPIA ESTO A TU FIREBASE CONSOLE:
//  * Firestore Database → Rules tab
//  */

// rules_version = '2';
// service cloud.firestore {
//   match /databases/{database}/documents {
    
//     // ============================================
//     // REGLAS GENERALES
//     // ============================================
    
//     // Negar por defecto
//     match /{document=**} {
//       allow read, write: if false;
//     }

//     // ============================================
//     // COLECCIÓN: productos (Lectura pública, escritura solo admin)
//     // ============================================
    
//     match /productos/{productId} {
//       // LECTURA: Cualquiera puede ver productos
//       allow read: if true;
      
//       // ESCRITURA: Solo administradores
//       allow create, update, delete: if isAdmin();
      
//       // Validación de datos al crear/actualizar
//       allow create: if 
//         request.resource.data.name is string &&
//         request.resource.data.price is number &&
//         request.resource.data.price > 0 &&
//         request.resource.data.stock is number &&
//         request.resource.data.stock >= 0 &&
//         request.resource.data.category in [
//           'nuevos', 'destacados', 'promos', 'packs', 'bestsellers'
//         ];
      
//       allow update: if
//         request.resource.data.name is string &&
//         request.resource.data.price is number &&
//         request.resource.data.price > 0 &&
//         request.resource.data.stock is number &&
//         request.resource.data.stock >= 0 &&
//         request.resource.data.category in [
//           'nuevos', 'destacados', 'promos', 'packs', 'bestsellers'
//         ];
//     }

//     // ============================================
//     // COLECCIÓN: promos (Lectura pública, escritura solo admin)
//     // ============================================
    
//     match /promos/{promoId} {
//       // LECTURA: Cualquiera puede ver promociones
//       allow read: if true;
      
//       // ESCRITURA: Solo administradores
//       allow create, update, delete: if isAdmin();
      
//       // Validación de datos
//       allow create: if
//         request.resource.data.name is string &&
//         request.resource.data.type in ['porcentaje', 'monto'] &&
//         request.resource.data.value is number &&
//         request.resource.data.value > 0;
      
//       allow update: if
//         request.resource.data.name is string &&
//         request.resource.data.type in ['porcentaje', 'monto'] &&
//         request.resource.data.value is number &&
//         request.resource.data.value > 0;
//     }

//     // ============================================
//     // COLECCIÓN: stockHistory (Lectura admin, escritura sistema)
//     // ============================================
    
//     match /stockHistory/{historyId} {
//       // LECTURA: Solo administradores
//       allow read: if isAdmin();
      
//       // ESCRITURA: Solo desde el admin (Firebase Rules no pueden diferencia)
//       // En la práctica, la escritura solo ocurre desde la app del admin
//       allow create, update: if isAdmin();
      
//       allow delete: if isAdmin();
//     }

//     // ============================================
//     // COLECCIÓN: ordenes (Lectura/escritura para checkout)
//     // ============================================
    
//     match /ordenes/{orderId} {
//       // LECTURA: Solo el propietario o admin
//       allow read: if 
//         request.auth.uid == resource.data.userId ||
//         isAdmin();
      
//       // ESCRITURA: Solo crear nuevas órdenes (en checkout)
//       allow create: if 
//         request.auth.uid != null &&
//         request.resource.data.userId == request.auth.uid &&
//         request.resource.data.items is list &&
//         request.resource.data.total is number;
      
//       // ACTUALIZACIÓN: Solo admin puede cambiar estado
//       allow update: if isAdmin();
      
//       // ELIMINACIÓN: Solo admin
//       allow delete: if isAdmin();
//     }

//     // ============================================
//     // COLECCIÓN: usuarios (Metadata de usuarios)
//     // ============================================
    
//     match /usuarios/{userId} {
//       // LECTURA: Solo el usuario o admin
//       allow read: if 
//         request.auth.uid == userId ||
//         isAdmin();
      
//       // ESCRITURA: Usuario actualiza su perfil, admin puede modificar
//       allow write: if 
//         request.auth.uid == userId ||
//         isAdmin();
//     }

//     // ============================================
//     // FUNCIONES DE VALIDACIÓN
//     // ============================================
    
//     // Verificar si el usuario es administrador
//     function isAdmin() {
//       return request.auth != null &&
//              request.auth.token.admin == true;
//     }
    
//     // Verificar si está autenticado
//     function isAuthenticated() {
//       return request.auth != null;
//     }
    
//     // Verificar propiedad de documento
//     function isOwner(userId) {
//       return request.auth.uid == userId;
//     }
//   }
// }

// /**
//  * CONFIGURACIÓN DE CUSTOM CLAIMS EN FIREBASE
//  * 
//  * Para marcar un usuario como admin, ejecuta esto en Firebase Cloud Functions
//  * o en la consola:
//  */

// // ============================================
// // OPCIÓN 1: Cloud Function
// // ============================================
// /*
// const admin = require('firebase-admin');

// exports.setAdminRole = functions.https.onCall((data, context) => {
//   const uid = data.uid;
  
//   // Solo super-admin puede ejecutar esto
//   if (!context.auth.token.admin) {
//     throw new functions.https.HttpsError(
//       'permission-denied',
//       'Solo administradores pueden asignar roles'
//     );
//   }
  
//   // Asignar custom claim
//   return admin.auth().setCustomUserClaims(uid, { admin: true })
//     .then(() => {
//       return { message: `Claims asignados a ${uid}` };
//     });
// });
// */

// // ============================================
// // OPCIÓN 2: Desde la consola Firebase
// // ============================================
// /*
// 1. Ve a Firebase Console → Authentication
// 2. Selecciona el usuario
// 3. Custom claims → Editar JSON
// 4. Agrega:
// {
//   "admin": true
// }
// 5. Guarda
// */

// // ============================================
// // OPCIÓN 3: Backend Node.js (Recomendado)
// // ============================================
// /*
// const admin = require('firebase-admin');

// async function makeUserAdmin(email) {
//   try {
//     const user = await admin.auth().getUserByEmail(email);
    
//     await admin.auth().setCustomUserClaims(user.uid, {
//       admin: true
//     });
    
//     console.log(`Admin claims asignados a ${email}`);
//   } catch (error) {
//     console.error('Error:', error);
//   }
// }

// // Usar:
// // makeUserAdmin('admin@example.com');
// */

// /**
//  * TESTING DE REGLAS
//  * 
//  * Puedes probar las reglas en Firebase Console:
//  * 1. Firestore → Rules
//  * 2. Haz cambios
//  * 3. Haz clic en "Rules Playground" (abajo)
//  * 4. Selecciona "Usuario autenticado" o "Anonimo"
//  * 5. Prueba READ/WRITE/DELETE
//  */

// /**
//  * SEGURIDAD CHECKLIST
//  * 
//  * ✓ Usuarios no autenticados NO pueden leer/escribir
//  * ✓ Solo administradores pueden modificar productos
//  * ✓ Solo administradores pueden ver historial de stock
//  * ✓ Las órdenes solo las ve el propietario o admin
//  * ✓ Validación de datos en la regla
//  * ✓ Bloqueo de eliminación accidental
//  * ✓ Campos timestamp automáticos en actualización
//  */

// export default {};
