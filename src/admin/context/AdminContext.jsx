import { useEffect, useState } from 'react';
import { AdminContext } from './AdminContextValue';
import { products as mockProducts } from '../../../mocks/AsyncService';
import { packsPorMayorMock, packsPlanchitasMock } from '../../../mocks/packsMayoristas';
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  addDoc,
  deleteDoc,
  Timestamp,
  setDoc,
} from 'firebase/firestore';
import { db } from '../../../firebase/firebase';

export const AdminProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [promos, setPromos] = useState([]);
  const [stockHistory, setStockHistory] = useState([]);
  const [sliderConfig, setSliderConfig] = useState(null);
  const [loading, setLoading] = useState(false);

  // ===== PRODUCTOS =====
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'productos'));
      const productsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productsData);
    } catch (error) {
      console.error('Error al traer productos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Crear producto
  const createProduct = async (productData) => {
    try {
      await addDoc(collection(db, 'productos'), {
        ...productData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      await fetchProducts();
    } catch (error) {
      console.error('Error al crear producto:', error);
    }
  };

  // Actualizar producto
  const updateProduct = async (productId, updates) => {
    try {
      const productRef = doc(db, 'productos', productId);
      await updateDoc(productRef, {
        ...updates,
        updatedAt: Timestamp.now(),
      });
      await fetchProducts();
    } catch (error) {
      console.error('Error al actualizar producto:', error);
    }
  };

  // Cambiar stock (suma o resta)
  const updateStock = async (productId, change) => {
    try {
      const product = products.find((p) => p.id === productId);
      if (!product) return;

      const newStock = Math.max(0, product.stock + change);
      const productRef = doc(db, 'productos', productId);

      await updateDoc(productRef, {
        stock: newStock,
        updatedAt: Timestamp.now(),
      });

      // Guardar en historial
      await addDoc(collection(db, 'stockHistory'), {
        productId,
        productName: product.name,
        previousStock: product.stock,
        newStock,
        change,
        timestamp: Timestamp.now(),
        type: change > 0 ? 'entrada' : 'salida',
      });

      await fetchProducts();
    } catch (error) {
      console.error('Error al actualizar stock:', error);
    }
  };

  // Cambiar precio
  const updatePrice = async (productId, newPrice) => {
    await updateProduct(productId, { price: newPrice });
  };

  // Activar/desactivar producto
  const toggleProductActive = async (productId) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    await updateProduct(productId, { active: !product.active });
  };

  // Asignar categoría
  const updateCategory = async (productId, category) => {
    await updateProduct(productId, { category });
  };

  // Borrar todos los productos
  const deleteAllData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'productos'));
      querySnapshot.forEach(async (document) => {
        await deleteDoc(doc(db, 'productos', document.id));
      });
      alert('Todos los productos han sido borrados.');
      await fetchProducts(); // Refrescar la lista
    } catch (error) {
      console.error('Error borrando productos:', error);
    }
  };

  // Importar productos del mock
  const importMockProducts = async () => {
    try {
      for (const product of mockProducts) {
        await addDoc(collection(db, 'productos'), {
          ...product,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        });
      }
      alert('Productos del mock importados exitosamente.');
      await fetchProducts();
    } catch (error) {
      console.error('Error importando productos:', error);
    }
  };

  // Importar packs de "Por mayor" del mock (src/mocks/packsMayoristas.js)
  const importMockPacksPorMayor = async () => {
    try {
      for (const pack of packsPorMayorMock) {
        await addDoc(collection(db, 'packsPorMayor'), {
          ...pack,
          createdAt: Timestamp.now(),
        });
      }
      alert('Packs de "Por mayor" importados exitosamente.');
    } catch (error) {
      console.error('Error importando packs de por mayor:', error);
    }
  };

  // Importar packs de "Planchitas" del mock (src/mocks/packsMayoristas.js)
  const importMockPacksPlanchitas = async () => {
    try {
      for (const pack of packsPlanchitasMock) {
        await addDoc(collection(db, 'packsPorMayor'), {
          ...pack,
          createdAt: Timestamp.now(),
        });
      }
      alert('Packs de "Planchitas" importados exitosamente.');
    } catch (error) {
      console.error('Error importando packs de planchitas:', error);
    }
  };

  // ===== PROMOCIONES =====
  const fetchPromos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'promos'));
      const promosData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPromos(promosData);
    } catch (error) {
      console.error('Error al traer promos:', error);
    }
  };

  // Crear promoción
  const createPromo = async (promoData) => {
    try {
      await addDoc(collection(db, 'promos'), {
        ...promoData,
        createdAt: Timestamp.now(),
        active: true,
      });
      await fetchPromos();
    } catch (error) {
      console.error('Error al crear promo:', error);
    }
  };

  // Actualizar promoción
  const updatePromo = async (promoId, updates) => {
    try {
      const promoRef = doc(db, 'promos', promoId);
      await updateDoc(promoRef, {
        ...updates,
        updatedAt: Timestamp.now(),
      });
      await fetchPromos();
    } catch (error) {
      console.error('Error al actualizar promo:', error);
    }
  };

  // Eliminar promoción
  const deletePromo = async (promoId) => {
    try {
      await deleteDoc(doc(db, 'promos', promoId));
      await fetchPromos();
    } catch (error) {
      console.error('Error al eliminar promo:', error);
    }
  };

  // ===== HISTORIAL DE STOCK =====
  const fetchStockHistory = async () => {
    try {
      const querySnapshot = await getDocs(
        collection(db, 'stockHistory')
      );
      const historyData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStockHistory(historyData.sort((a, b) => b.timestamp - a.timestamp));
    } catch (error) {
      console.error('Error al traer historial:', error);
    }
  };

  // ===== UTILIDADES =====

  // Detectar stock bajo (< 3)
  const lowStockProducts = products.filter((p) => p.stock < 3 && p.active);

  // Productos sin stock
  const outOfStockProducts = products.filter((p) => p.stock === 0);

  // Métrica: productos más vendidos (basado en órdenes)
  const getTopSellingProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'orders'));
      const salesMap = {};

      querySnapshot.docs.forEach((doc) => {
        const order = doc.data();
        if (order.items) {
          order.items.forEach((item) => {
            salesMap[item.id] = (salesMap[item.id] || 0) + item.quantity;
          });
        }
      });

      return products
        .map((p) => ({
          ...p,
          soldUnits: salesMap[p.id] || 0,
          estimatedRevenue: (salesMap[p.id] || 0) * p.price,
        }))
        .sort((a, b) => b.soldUnits - a.soldUnits);
    } catch (error) {
      console.error('Error al calcular ventas:', error);
      return [];
    }
  };

  // ===== SLIDER CONFIG =====
  const fetchSliderConfig = async () => {
    try {
      const configSnap = await getDocs(collection(db, 'sliderConfig'));
      if (configSnap.docs.length > 0) {
        const config = configSnap.docs[0].data();
        setSliderConfig(config);
      } else {
        setSliderConfig({ currentIds: [], upcomingIds: [] });
      }
    } catch (error) {
      console.error('Error al traer config del slider:', error);
      setSliderConfig({ currentIds: [], upcomingIds: [] });
    }
  };

  const updateSliderConfig = async (currentIds = [], upcomingIds = []) => {
    try {
      await setDoc(doc(db, 'sliderConfig', 'main'), {
        currentIds,
        upcomingIds,
        updatedAt: Timestamp.now(),
      });
      setSliderConfig({ currentIds, upcomingIds });
    } catch (error) {
      console.error('Error al actualizar config del slider:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchPromos();
    fetchStockHistory();
    fetchSliderConfig();
  }, []);

  const value = {
    // Productos
    products,
    loading,
    updateProduct,
    updateStock,
    updatePrice,
    toggleProductActive,
    updateCategory,
    fetchProducts,
    createProduct,
    deleteAllData,
    importMockProducts,

    // Packs mayoristas
    importMockPacksPorMayor,
    importMockPacksPlanchitas,

    // Promos
    promos,
    createPromo,
    updatePromo,
    deletePromo,
    fetchPromos,

    // Historial
    stockHistory,
    fetchStockHistory,

    // Slider Config
    sliderConfig,
    updateSliderConfig,
    fetchSliderConfig,

    // Utilidades
    lowStockProducts,
    outOfStockProducts,
    getTopSellingProducts,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};