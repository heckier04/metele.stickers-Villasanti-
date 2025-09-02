import React, { useContext, useState, useEffect } from 'react';
import { CartContext } from '../context/CartContext';
import CartView from './CartView';
import EmptyCart from './EmptyCart';
import Spinner from './Spinner';

const Cart = () => {
const { cart } = useContext(CartContext);
const [loading, setLoading] = useState(true);

useEffect(() => {
    
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
}, []);

if (loading) return <Spinner fullscreen type="dual-ring" />;

return <>{cart.length ? <CartView /> : <EmptyCart />}</>;
};

export default Cart;
