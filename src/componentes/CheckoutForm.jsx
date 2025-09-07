import { useState } from "react";
import { useCart } from "../context/CartContext";
import "../sass/CheckoutForm.scss";

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

const handleSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
    onSubmit(formData);
    setIsProcessing(false);
    }, 2000);
};

return (
    <div className="checkout-form">
    <form onSubmit={handleSubmit} className="form-container">


        <div className="form-group">
        <div className="form-grid">
            <input name="firstName"value={formData.firstName}onChange={handleChange}placeholder="Nombre"required/>
            <input name="lastName"value={formData.lastName}onChange={handleChange}placeholder="Apellido"required/>
        </div>
        </div>

        <div className="form-group">
        <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email" required/>
        </div>

        <div className="form-group">
        <input name="phone"  value={formData.phone} onChange={handleChange} placeholder="Teléfono" required/>
        </div>


        <div className="form-group">
        <input name="address" value={formData.address} onChange={handleChange} placeholder="Dirección"required/>
        </div>


        <div className="form-group">
        <div className="form-grid">
            <input name="city" value={formData.city} onChange={handleChange} placeholder="Ciudad" required />
            <input name="zipCode" value={formData.zipCode} onChange={handleChange} placeholder="Código Postal" required />
        </div>
        </div>

        <div className="form-group">
        <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange}>
            <option value="card">Tarjeta</option>
            <option value="paypal">PayPal</option>
            <option value="transfer">Transferencia</option>
        </select>
        </div>


        <button type="submit" className="submit-button" disabled={isProcessing}>
        {isProcessing && <div className="loading-spinner"></div>}
        {isProcessing ? "Procesando..." : `Pagar $${cartTotal().toFixed(2)}`}
        </button>

    </form>
    </div>
);
};

export default CheckoutForm;
