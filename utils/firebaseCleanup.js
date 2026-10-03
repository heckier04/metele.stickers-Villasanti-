/**
 * SCRIPT PARA LIMPIAR Y RECARGAR FIREBASE
 * Ejecuta esto en la consola del navegador una sola vez
 */

import { collection, deleteDoc, query, getDocs } from 'firebase/firestore';
import { db } from './firebase/firebase';
import { uploadProductsBatch } from './utils/firebaseUploadHelper';
import { products } from './mocks/AsyncService';

export const cleanAndReloadFirebase = async () => {
  console.log('🔄 Limpiando Firebase...');
  
  try {
    // Eliminar todos los documentos existentes
    const q = query(collection(db, 'productos'));
    const snapshot = await getDocs(q);
    
    for (const doc of snapshot.docs) {
      await deleteDoc(doc.ref);
    }
    
    console.log(`✅ ${snapshot.docs.length} documentos eliminados`);
    
    // Recargar con nuevos datos
    console.log('📤 Subiendo nuevos productos...');
    const result = await uploadProductsBatch(products, (progress) => {
      console.log(`${progress.percentage}% - ${progress.current}/${progress.total}`);
    });
    
    console.log(`✅ COMPLETADO`);
    console.log(`✔️ Subidos: ${result.success}`);
    console.log(`❌ Fallos: ${result.failed}`);
    
    if (result.errors.length > 0) {
      console.error('Errores:', result.errors);
    }
    
    // Recargar la página
    setTimeout(() => {
      window.location.reload();
    }, 2000);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
};

// Para usar: en la consola del navegador, ejecuta:
// import { cleanAndReloadFirebase } from './utils/firebaseCleanup';
// cleanAndReloadFirebase();
