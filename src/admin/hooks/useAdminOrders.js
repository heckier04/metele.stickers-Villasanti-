import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../../../firebase/firebase';
import { confirmOrderPayment, cancelOrder } from '../../utils/orders'; // ajustar si moviste orders.js

export const useAdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState(null);

  useEffect(() => {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setOrders(data);
        setLoading(false);
      },
      (error) => {
        console.error('Error escuchando órdenes:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const pendingOrders = orders.filter((o) => o.status === 'pending_payment');
  const paidOrders = orders.filter((o) => o.status === 'paid');
  const cancelledOrders = orders.filter((o) => o.status === 'cancelled');

  const confirmOrder = async (orderId) => {
    setActionError(null);
    try {
      await confirmOrderPayment(orderId);
    } catch (error) {
      console.error('Error confirmando orden:', error);
      setActionError(`No se pudo confirmar la orden: ${error.message}`);
    }
  };

  const rejectOrder = async (orderId) => {
    setActionError(null);
    try {
      await cancelOrder(orderId);
    } catch (error) {
      console.error('Error cancelando orden:', error);
      setActionError(`No se pudo cancelar la orden: ${error.message}`);
    }
  };

  return {
    orders,
    pendingOrders,
    paidOrders,
    cancelledOrders,
    loading,
    actionError,
    confirmOrder,
    rejectOrder,
  };
};