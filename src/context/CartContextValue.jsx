import { createContext, useContext } from "react";

export const defaultCartValue = {
  cart: [],
  clear: () => {},
  addItem: () => {},
  removeItem: () => {},
  cartQuantity: () => 0,
  cartTotal: () => 0,
  itemQuantity: () => 0,
};

export const CartContext = createContext(defaultCartValue);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de CartProvider');
  }
  return context;
};
