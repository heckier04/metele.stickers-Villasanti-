import '../sass/CartWidget.scss';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const CartWidget = () => {
  const { cartQuantity } = useCart(); 

  return (
    <Link to="/cart" className="cart-widget">
      <span>🛒</span>
      <span style={{ color: 'red' }}>{cartQuantity()}</span>
    </Link>
  );
};

export default CartWidget;
