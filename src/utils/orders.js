// utils/orders.js
import { db } from "../../firebase/firebase"; // ajustar según dónde ubiques este archivo
import { doc, updateDoc, getDoc, increment } from "firebase/firestore";

/**
 * Confirma el pago de una orden:
 * - Descuenta el stock recién en este momento (no antes)
 * - Suma las unidades vendidas a cada producto (soldUnits), para poder
 *   ordenar por "más vendido" en la tienda sin recorrer todas las órdenes
 * - Marca la orden como "paid"
 * - Es idempotente: si ya estaba pagada, no vuelve a descontar stock ni sumar ventas
 *
 * Hoy la llama el admin manualmente (botón "confirmar transferencia").
 * Mañana la va a llamar el webhook de Mercado Pago automáticamente.
 */
export const confirmOrderPayment = async (orderId) => {
  const orderRef = doc(db, "orders", orderId);
  const orderSnap = await getDoc(orderRef);

  if (!orderSnap.exists()) {
    throw new Error("Orden no encontrada");
  }

  const order = orderSnap.data();

  if (order.status === "paid") {
    console.warn(`Orden ${orderId} ya estaba pagada, no se vuelve a descontar stock.`);
    return;
  }

  for (const item of order.items) {
    const productRef = doc(db, "productos", item.id);
    const productSnap = await getDoc(productRef);

    if (!productSnap.exists()) continue;

    const stockActual = productSnap.data().stock;
    await updateDoc(productRef, {
      stock: Math.max(0, stockActual - item.quantity),
      soldUnits: increment(item.quantity),
    });
  }

  await updateDoc(orderRef, {
    status: "paid",
    paidAt: new Date(),
  });
};

/**
 * Cancela una orden pendiente (ej: pasaron 48hs y nunca llegó el comprobante).
 * No hay que tocar stock porque nunca se descontó.
 */
export const cancelOrder = async (orderId) => {
  const orderRef = doc(db, "orders", orderId);
  await updateDoc(orderRef, {
    status: "cancelled",
    cancelledAt: new Date(),
  });
};