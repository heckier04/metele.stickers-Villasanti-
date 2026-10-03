import { useCart } from "../context/CartContextValue";
import '../sass/CheckoutSummary.scss';

const CheckoutSummary = ({ costoEnvio = 0, tipoEntrega = "domicilio" }) => {
  const { cart, cartTotal } = useCart();

  return (
    <div className="checkout-summary">
      <h3>Resumen del Pedido</h3>
      {cart.map((item) => (
        <div key={item.id} className="checkout-item">
          <span>{item.name} (x{item.quantity})</span>
          <span>${(item.price * item.quantity).toFixed(2)}</span>
        </div>
      ))}

      <div className="checkout-subtotal">
        <span>Subtotal:</span>
        <span>${cartTotal().toFixed(2)}</span>
      </div>

      <div className="checkout-shipping">
        <span>{tipoEntrega === "domicilio" ? "Envío:" : "Retiro en punto:"}</span>
        <span>{costoEnvio === 0 ? "Gratis" : `$${costoEnvio.toFixed(2)}`}</span>
      </div>

      <div className="checkout-total">
        <span>Total:</span>
        <span>${(cartTotal() + costoEnvio).toFixed(2)}</span>
      </div>
    </div>
  );
};

export default CheckoutSummary;