import '../sass/CartWidget.scss';
const CartWidget = ({ count = 3 }) => {
    return (
        <div className="cart-widget">
            <span role="img">🛒</span>
            <span className="cart-count">{count}</span>
        </div>
    );
};

export default CartWidget;
