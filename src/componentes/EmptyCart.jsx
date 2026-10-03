import React from 'react';
import { Link } from 'react-router-dom';
import '../sass/EmptyCart.scss';

const EmptyCart = () => {
  return (
    <div className="empty-cart">
      <h2 className="empty-cart__title">Tu carrito está vacío 😭</h2>
      <h4 className="empty-cart__subtitle">Te invitamos a ver nuestros productos</h4>
      <Link className="empty-cart__btn" to="/">
        Ir a comprar
      </Link>
    </div>
  );
};

export default EmptyCart;
