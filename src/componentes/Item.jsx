import { Link } from "react-router-dom";
import '../sass/Item.scss';

const Item = ({ prod }) => {
    return (
        <div className="item-card">
            <img src={prod.img} alt={prod.name} className="item-image" />
            <h3 className="item-title">{prod.name}</h3>
            <p className="item-price">${prod.price}</p>
            <Link to={`/item/${prod.id}`} className="item-link">Ver detalle</Link>
            <button className="item-btn">Agregar al carrito</button>
        </div>
    );
};

export default Item;
