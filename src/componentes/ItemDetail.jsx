import ItemCount from "./ItemCount";
import { useCart } from "../context/CartContextValue";
import { Link } from "react-router-dom"
import { useState } from "react"
import { getOptimizedImageUrl } from "../utils/cloudinaryHelper";
import '../sass/itemDetail.scss';



const ItemDetail = ({ stuff }) => {
    const { addItem, itemQuantity } = useCart();
    const [purchase, setPurchase] = useState(false);

    const onAdd = (quantity) => {
        addItem(stuff, quantity);
        setPurchase(true);
    };

    const stockActualizado = stuff.stock - itemQuantity(stuff.id);
    const placeholder = 'https://via.placeholder.com/600x600?text=Imagen+No+Disponible';
    const imageSrc = stuff.img ? getOptimizedImageUrl(stuff.img, 600) : placeholder;

    return (
        <div className="item-detail">
            <div className="item-detail__image-wrapper">
              <div className="item-detail__image-card">
                <img
                  className="item-detail__image"
                  alt={stuff.name}
                  src={imageSrc}
                  onError={(e) => {
                    e.target.onerror = null;
                    if (e.target.src !== placeholder) {
                      e.target.src = placeholder;
                    }
                  }}
                />
              </div>
            </div>
            <div className="item-detail__info">
                <h1>Detalle de: {stuff.name}</h1>
                <p className="item-detail__description">{stuff.description}</p>
                <p className="item-detail__price">Precio: ${stuff.price},00</p>
                {purchase ? (
                    <div className="item-detail__actions">
                        <Link to='/'>Seguir Comprando</Link>
                        <Link to='/cart'>Ir al carrito</Link>
                    </div>
                ) : (
                    <ItemCount stock={stockActualizado} onAdd={onAdd} />
                )}
            </div>
        </div>
    );
}

export default ItemDetail;