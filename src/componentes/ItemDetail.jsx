import ItemCount from "./ItemCount";
import '../sass/Item.scss';

const ItemDetail = ({ stuff }) => {
    const onAdd = (quantity) => {
    alert(`Agregaste ${quantity} unidades de ${stuff.name} al carrito`);
};

return (
    <div className="item-detail">
        <h2>Detalle de: {stuff.name}</h2>
        <img alt={stuff.name} src={stuff.img} width={300} />
        <p>{stuff.description}</p>
        <p>Stock disponible: {stuff.stock} unidades</p>
        <p>Precio: ${stuff.price?.toLocaleString("es-AR")}</p>
        <ItemCount stock={stuff.stock} initial={1} onAdd={onAdd} />
    </div>
    );
};

export default ItemDetail;