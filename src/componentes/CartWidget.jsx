import { useCart } from '../context/CartContextValue';
import '../sass/CartWidget.scss';

const CartWidget = () => {
  const { cartQuantity, setIsOpen } = useCart();

  const quantity = cartQuantity();

  return (
    <div className="cart-widget" onClick={() => setIsOpen(true)}>
      <span className="cart-icon">🛒</span>

      {quantity > 0 && (
        <span className="cart-badge">
          {quantity}
        </span>
      )}
    </div>
  );
};

export default CartWidget;