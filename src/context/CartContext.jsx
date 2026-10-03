import { useEffect, useState } from "react";
import { CartContext } from "./CartContextValue";

export const CartProvider = ({ children }) => {

  const [cart, setCart] = useState(() => {
    const stored = localStorage.getItem('carrito');
    return stored ? JSON.parse(stored) : [];
  });

  const [isOpen, setIsOpen] = useState(false);

  // Persistencia
  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(cart));
  }, [cart]);

  // 🛒 AGREGAR
  const addItem = (item, qty = 1) => {
    const exists = cart.find(prod => prod.id === item.id);

    if (exists) {
      setCart(cart.map(prod =>
        prod.id === item.id
          ? { ...prod, quantity: prod.quantity + qty }
          : prod
      ));
    } else {
      setCart([...cart, { ...item, quantity: qty }]);
    }

    setIsOpen(true); // 🔥 abre carrito automáticamente
  };

  // ❌ ELIMINAR
  const removeItem = (id) => {
    setCart(cart.filter(prod => prod.id !== id));
  };

  // 🧹 LIMPIAR
  const clear = () => setCart([]);

  // 🔢 ACTUALIZAR CANTIDAD (+ / -)
  const updateQuantity = (id, amount) => {
    setCart(cart.map(prod => {
      if (prod.id === id) {
        const newQty = prod.quantity + amount;
        return newQty <= 0 ? null : { ...prod, quantity: newQty };
      }
      return prod;
    }).filter(Boolean));
  };

  // 📊 TOTAL $
  const cartTotal = () =>
    cart.reduce((acc, prod) => acc + prod.price * prod.quantity, 0);

  // 🔢 TOTAL ITEMS
  const cartQuantity = () =>
    cart.reduce((acc, prod) => acc + prod.quantity, 0);

  // 📦 CANTIDAD DE UN ITEM
  const itemQuantity = (id) => {
    const item = cart.find(prod => prod.id === id);
    return item ? item.quantity : 0;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addItem,
        removeItem,
        clear,
        updateQuantity,
        cartTotal,
        cartQuantity,
        itemQuantity,

        // 🔥 CONTROL DRAWER
        isOpen,
        setIsOpen
      }}
    >
      {children}
    </CartContext.Provider>
  );
};