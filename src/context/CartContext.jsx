import { createContext, useEffect, useState, useContext } from "react";
export const CartContext = createContext();

// Local storage
const prodLS = JSON.parse(localStorage.getItem('carrito')) || [];


export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(prodLS);

  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(cart));
  }, [cart]);

  // Funciones del carrito
  const addItem = (item, qty) => {
    if (isInCart(item.id)) {
      const carritoActualizado = cart.map((prod) =>
        prod.id === item.id ? { ...prod, quantity: prod.quantity + qty } : prod
      );
      setCart(carritoActualizado);
    } else {
      setCart([...cart, { ...item, quantity: qty }]);
    }
  };

  const clear = () => setCart([]);
  const removeItem = (id) => setCart(cart.filter((prod) => prod.id !== id));

  const cartTotal = () =>
    cart.reduce((acc, prod) => acc + prod.quantity * prod.price, 0);

  const cartQuantity = () =>
    cart.reduce((acc, prod) => acc + prod.quantity, 0);

  const isInCart = (id) => cart.some((prod) => prod.id === id);

  const itemQuantity = (id) => {
    const itemInCart = cart.find((item) => item.id === id);
    return itemInCart ? itemInCart.quantity : 0;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        clear,
        addItem,
        removeItem,
        cartQuantity,
        cartTotal,
        itemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
