// Checkout.jsx
import CheckoutForm from "./CheckoutForm";
import CheckoutSummary from "./CheckoutSummary";
import { useCart } from "../context/CartContext";
import { db } from "../../firebase/firebase";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom"; 

const Checkout = () => {
const { cart, clear } = useCart();
  const navigate = useNavigate();

const handleCheckoutSubmit = async (formData) => {
    try {
        if (cart.length === 0) {
        alert("No hay productos en el carrito.");
        return;
        }


    const orderData = {
        buyer: formData,
        items: cart.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity
        })),
        total: cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
        createdAt: new Date()
        };

    const orderRef = await addDoc(collection(db, "orders"), orderData);
    console.log("Orden creada con ID:", orderRef.id);

    for (let item of cart) {
        const productRef = doc(db, "productos", item.id);
            await updateDoc(productRef, {
            stock: Math.max(0, item.stock - item.quantity)
        });
    }


    clear();
    alert(`¡Pedido procesado exitosamente! ID: ${orderRef.id}`);


    navigate("/");
    } catch (error) {
        console.error("Error procesando el pedido:", error);
        alert("Ocurrió un error al procesar el pedido.");
    }
};

return (
    <div className="max-w-4xl mx-auto p-6 grid md:grid-cols-2 gap-8">
        <CheckoutForm onSubmit={handleCheckoutSubmit} />
        <CheckoutSummary />
    </div>
    );
};

export default Checkout;
