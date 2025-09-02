import React from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import "../sass/CartView.scss";

const CartView = () => {
const { cart, clear, removeItem, cartTotal } = useCart();

if (cart.length === 0) {
    return (
        <div className="cart-view">
            <h1>Tu Carrito</h1>
            <p>El carrito está vacío</p>
            <Link to="/">Continuar Comprando</Link>
        </div>
    );
}

return (
        <div className="cart-view">
            <h1>Tu Carrito</h1>
            <div className="cart-items">
                {cart.map((item) => (
                <div key={item.id} className="cart-item">
                    <img src={item.img} alt={item.name} className="cart-item__image" />
                    <div className="cart-item__info">
                    <h3>{item.name}</h3>
                    <p>Precio unitario: ${item.price}</p>
                    <p>Unidades: {item.quantity}</p>
                    <p>Precio total: ${item.price * item.quantity}</p>
                    </div>
                    <button onClick={() => removeItem(item.id)}>Eliminar</button>
                </div>
                ))}
            </div>

            <div className="cart-summary">
                <h2>Total a pagar: ${cartTotal()}</h2>
                <button onClick={clear}>Vaciar Carrito</button>
                <Link to="/checkout">Finalizar Compra</Link>
            </div>
        </div>
    );
};

export default CartView;
