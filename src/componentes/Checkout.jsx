// Checkout.jsx
import { useState } from "react";
import CheckoutForm from "./CheckoutForm";
import CheckoutSummary from "./CheckoutSummary";
import { useCart } from "../context/CartContextValue";
import { db } from "../../firebase/firebase";
import { collection, addDoc, doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "../sass/checkout.scss";

const Checkout = () => {
  const { cart, clear } = useCart();
  const navigate = useNavigate();

  // Estado de entrega compartido entre el form y el resumen,
  // así el total del resumen se actualiza en vivo.
  const [entrega, setEntrega] = useState({ tipo: "domicilio", costo: 1500, punto: null });

  const handleCheckoutSubmit = async (formData) => {
    try {
      if (cart.length === 0) {
        alert("No hay productos en el carrito.");
        return;
      }

      // 1. Verificar stock REAL en Firestore antes de crear la orden
      // (el stock del carrito puede estar desactualizado si pasó tiempo
      // desde que se agregó el producto)
      for (let item of cart) {
        const productRef = doc(db, "productos", item.id);
        const productSnap = await getDoc(productRef);

        if (productSnap.exists()) {
          // Es un producto normal: sí controlamos stock
          const stockActual = productSnap.data().stock;
          if (stockActual < item.quantity) {
            alert(`Sin stock suficiente de "${item.name}". Quedan ${stockActual}.`);
            return;
          }
          continue;
        }

        // No está en "productos": puede ser un pack de packsPorMayor
        // (Planchitas comprables por carrito), que no lleva control de stock.
        const packRef = doc(db, "packsPorMayor", item.id);
        const packSnap = await getDoc(packRef);

        if (!packSnap.exists()) {
          alert(`El producto "${item.name}" ya no existe.`);
          return;
        }
        // Si es un pack válido, seguimos sin chequear stock.
      }

      // 2. Crear la orden como PENDIENTE. Todavía NO se toca el stock.
      const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
      const costoEnvio = formData.entrega?.costo ?? 0;

      const orderData = {
        buyer: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          zipCode: formData.zipCode,
        },
        entrega: formData.entrega, // { tipo, costo, punto }
        items: cart.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        subtotal,
        costoEnvio,
        total: subtotal + costoEnvio,
        status: "pending_payment", // pending_payment | paid | cancelled
        paymentMethod: formData.paymentMethod,
        createdAt: new Date(),
      };

      const orderRef = await addDoc(collection(db, "orders"), orderData);
      console.log("Orden pendiente creada con ID:", orderRef.id);

      // El carrito se limpia porque la orden ya quedó registrada.
      // El STOCK y el estado "paid" se actualizan recién cuando se
      // confirma el pago (ver confirmOrderPayment en utils/orders.js).
      clear();

      if (formData.paymentMethod === "transfer") {
        // Flujo transferencia: redirige a WhatsApp con el ID de orden
        // para que el comprador mande el comprobante.
        const mensaje = encodeURIComponent(
          `Hola! Ya transferí el pedido #${orderRef.id} por un total de $${orderData.total}. Te paso el comprobante.`
        );
        window.open(`https://wa.me/TUNUMERO?text=${mensaje}`, "_blank");
      }

      alert(
        `¡Pedido recibido! ID: ${orderRef.id}. Queda pendiente de confirmación de pago.`
      );
      navigate("/");
    } catch (error) {
      console.error("Error procesando el pedido:", error);
      alert("Ocurrió un error al procesar el pedido.");
    }
  };

  return (
    <div className="checkout-container">
      <CheckoutForm onSubmit={handleCheckoutSubmit} entrega={entrega} setEntrega={setEntrega} />
      <CheckoutSummary costoEnvio={entrega.costo} tipoEntrega={entrega.tipo} />
    </div>
  );
};

export default Checkout;