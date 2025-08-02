import { Link } from "react-router-dom";
import React from 'react';

const Item = ({ prod }) => {
    return (
        <div className="item-card">
            <img src={prod.image} alt={prod.title} className="item-image" />
            <h3 className="item-title">{prod.title}</h3>
            <p className="item-price">${prod.price}</p>
            <Link to={`/item/${prod.id}`} className="item-link">Ver detalle</Link>
            <button className="item-btn">Agregar al carrito</button>
        </div>
    );
};

export default Item;
