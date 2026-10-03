import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContextValue";
import { getOptimizedImageUrl } from "../utils/cloudinaryHelper";
import "../sass/components/cartDrawer.scss";

const CartDrawer = () => {
  const {
    cart,
    removeItem,
    updateQuantity,
    cartTotal,
    isOpen,
    setIsOpen,
  } = useCart();

  const navigate = useNavigate();

  const handleCheckout = () => {
    setIsOpen(false); // cerramos el drawer
    navigate("/checkout"); // y navegamos al checkout
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`drawer-overlay ${isOpen ? "show" : ""}`}
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer */}
      <div className={`cart-drawer ${isOpen ? "open" : ""}`}>
        <div className="drawer-header">
          <h2>Carrito</h2>
          <button onClick={() => setIsOpen(false)}>✕</button>
        </div>

        <div className="drawer-content">
          {cart.length === 0 ? (
            <p className="empty">Tu carrito está vacío</p>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="drawer-item">
                <img src={getOptimizedImageUrl(item.img, 120)} alt={item.name} />

                <div className="info">
                  <p>{item.name}</p>
                  <span>${item.price}</span>

                  <div className="qty">
                    <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                  </div>
                </div>

                <button
                  className="remove"
                  onClick={() => removeItem(item.id)}
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>

        <div className="drawer-footer">
          <h3>Total: ${cartTotal()}</h3>
          <button
            className="checkout-btn"
            onClick={handleCheckout}
            disabled={cart.length === 0}
          >
            Finalizar compra
          </button>
        </div>
      </div>
    </>
  );
};

export default CartDrawer;