import { Link } from "react-router-dom";
import { useCart } from "../context/CartContextValue";
import '../sass/Item.scss';

const Item = ({ prod }) => {

  const { addItem } = useCart();

  const getImageUrl = (url) => {
    if (!url) return 'https://via.placeholder.com/300x300?text=Sticker';

    if (url.includes('cloudinary.com')) {
      return url
        .replace(/\.heic$/i, '.jpg')
        .replace('/upload/', '/upload/f_auto,q_auto,w_500/');
    }

    return url;
  };

  const imageUrl = getImageUrl(prod.img);

  const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/300x300?text=Sticker';
  };

  return (
    <div className="item-card">

      <Link to={`/item/${prod.id}`} className="item-image-container">
        <img 
          src={imageUrl} 
          alt={prod.name} 
          className="item-image"
          loading="lazy"
          onError={handleImageError}
        />
      </Link>

      {/* 🔧 Este wrapper es el que permite empujar el botón al fondo
          y que todas las tarjetas queden parejas */}
      <div className="item-info">
        <h3 className="item-title">{prod.name}</h3>
        <p className="item-price">${prod.price}</p>

        <button 
          className="item-btn"
          onClick={() => addItem(prod)}
        >
          Agregar al carrito
        </button>
      </div>

    </div>
  );
};

export default Item;