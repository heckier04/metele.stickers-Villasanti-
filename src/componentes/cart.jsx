import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContextValue";
import CartView from "./cartView";
import EmptyCart from "./EmptyCart";
import Spinner from "./Spinner";

const Cart = () => {
  const { cart } = useCart();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Spinner fullscreen type="dual-ring" />;

  return <>{cart.length ? <CartView /> : <EmptyCart />}</>;
};

export default Cart;
