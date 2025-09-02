// CheckoutSummary.jsx
import { useCart } from "../context/CartContext";

const CheckoutSummary = () => {
  const { cart, cartTotal } = useCart();

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="font-bold mb-4">Resumen del Pedido</h3>
      {cart.map((item) => (
        <div key={item.id} className="flex justify-between mb-2">
          <span>{item.name} (x{item.quantity})</span>
          <span>${(item.price * item.quantity).toFixed(2)}</span>
        </div>
      ))}
      <div className="border-t pt-2 flex justify-between font-bold">
        <span>Total:</span>
        <span>${cartTotal().toFixed(2)}</span>
      </div>
    </div>
  );
};

export default CheckoutSummary;
