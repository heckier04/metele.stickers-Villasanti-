// CheckoutForm.jsx
import { useState } from "react";
import { useCart } from "../context/CartContext";

const CheckoutForm = ({ onSubmit }) => {
const { cart, cartTotal } = useCart();
const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    paymentMethod: "card",
});

const [isProcessing, setIsProcessing] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = (e) => {e.preventDefault();setIsProcessing(true);setTimeout(() => {onSubmit(formData);setIsProcessing(false);
    }, 2000);
};

return (
    <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
            <input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Nombre" required />
            <input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Apellido" required />
        </div>
        <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" type="email" required />
        <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Teléfono" required />
        <input name="address" value={formData.address} onChange={handleChange} placeholder="Dirección" required />
        <div className="grid grid-cols-2 gap-4">
            <input name="city" value={formData.city} onChange={handleChange} placeholder="Ciudad" required />
            <input name="zipCode" value={formData.zipCode} onChange={handleChange} placeholder="Código Postal" required />
        </div>
        <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange}>
            <option value="card">Tarjeta</option>
            <option value="paypal">PayPal</option>
            <option value="transfer">Transferencia</option>
        </select>
        <button type="submit" disabled={isProcessing}>
            {isProcessing ? "Procesando..." : `Pagar $${cartTotal().toFixed(2)}`}
        </button>
    </form>
    );
};

export default CheckoutForm;
