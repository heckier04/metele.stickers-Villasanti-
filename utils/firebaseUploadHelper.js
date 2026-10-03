import { collection, addDoc, writeBatch, doc } from 'firebase/firestore';
import { db } from '../firebase/firebase';

/**
 * Valida la estructura de un producto antes de subirlo a Firebase
 * @param {object} product - Producto a validar
 * @returns {object} { isValid: boolean, errors: string[] }
 */
export const validateProduct = (product) => {
  const errors = [];

  if (!product.name || typeof product.name !== 'string') {
    errors.push('El nombre es requerido y debe ser texto');
  }

  if (!product.description || typeof product.description !== 'string') {
    errors.push('La descripción es requerida');
  }

  if (typeof product.price !== 'number' || product.price < 0) {
    errors.push('El precio debe ser un número positivo');
  }

  if (typeof product.stock !== 'number' || product.stock < 0) {
    errors.push('El stock debe ser un número positivo');
  }

  if (!product.category || typeof product.category !== 'string') {
    errors.push('La categoría es requerida');
  }

  if (!product.img || typeof product.img !== 'string' || !product.img.startsWith('http')) {
    errors.push('La imagen debe ser una URL válida de Cloudinary');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Procesa un producto: agrega metadatos antes de subirlo
 * @param {object} product - Producto a procesar
 * @returns {object} Producto procesado
 */
export const processProduct = (product) => {
  return {
    ...product,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

/**
 * Sube un producto individual a Firestore
 * @param {object} product - Producto a subir
 * @returns {Promise<string>} ID del documento creado
 */
export const uploadSingleProduct = async (product) => {
  const validation = validateProduct(product);

  if (!validation.isValid) {
    throw new Error(`Validación fallida: ${validation.errors.join(', ')}`);
  }

  const processedProduct = processProduct(product);
  const collectionRef = collection(db, 'productos');

  try {
    const docRef = await addDoc(collectionRef, processedProduct);
    return docRef.id;
  } catch (error) {
    throw new Error(`Error al subir producto "${product.name}": ${error.message}`);
  }
};

/**
 * Sube múltiples productos a Firestore usando batch (más eficiente)
 * @param {array} products - Array de productos a subir
 * @param {function} onProgress - Callback para actualizar progreso (opcional)
 * @returns {Promise<object>} { success: number, failed: number, errors: string[] }
 */
export const uploadProductsBatch = async (products, onProgress = null) => {
  if (!Array.isArray(products) || products.length === 0) {
    throw new Error('Debes proporcionar un array de productos');
  }

  const collectionRef = collection(db, 'productos');
  const batch = writeBatch(db);
  const errors = [];
  let successCount = 0;

  for (let i = 0; i < products.length; i++) {
    const product = products[i];

    const validation = validateProduct(product);
    if (!validation.isValid) {
      errors.push(`Producto ${i + 1} - ${product.name}: ${validation.errors.join(', ')}`);
      continue;
    }

    const processedProduct = processProduct(product);

    const docRef = doc(collectionRef);
    batch.set(docRef, processedProduct);
    successCount++;

    if (onProgress) {
      onProgress({
        current: i + 1,
        total: products.length,
        percentage: Math.round(((i + 1) / products.length) * 100),
      });
    }
  }

  if (successCount > 0) {
    try {
      await batch.commit();
    } catch (error) {
      errors.push(`Error al confirmar la carga: ${error.message}`);
    }
  }

  return {
    success: successCount,
    failed: products.length - successCount,
    errors,
  };
};

/**
 * Sube productos uno por uno (más lento pero con mejor manejo de errores individuales)
 * @param {array} products - Array de productos a subir
 * @param {function} onProgress - Callback para actualizar progreso
 * @returns {Promise<object>} { success: number, failed: number, errors: string[] }
 */
export const uploadProductsSequential = async (products, onProgress = null) => {
  if (!Array.isArray(products) || products.length === 0) {
    throw new Error('Debes proporcionar un array de productos');
  }

  const errors = [];
  let successCount = 0;

  for (let i = 0; i < products.length; i++) {
    try {
      await uploadSingleProduct(products[i]);
      successCount++;
    } catch (error) {
      errors.push(error.message);
    }

    if (onProgress) {
      onProgress({
        current: i + 1,
        total: products.length,
        percentage: Math.round(((i + 1) / products.length) * 100),
      });
    }
  }

  return {
    success: successCount,
    failed: products.length - successCount,
    errors,
  };
};