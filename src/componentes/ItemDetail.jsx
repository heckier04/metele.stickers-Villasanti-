import ItemCount from "./ItemCount";
import { CartContext } from "../context/CartContext"
import { Link } from "react-router-dom"
import { useContext, useState } from "react"
import '../sass/Item.scss';



const ItemDetail = ({ stuff }) => {
    const { addItem, itemQuantity } = useContext(CartContext);
    const [purchase, setPurchase] = useState(false);

    const onAdd = (quantity) => {
        addItem(stuff, quantity);
        setPurchase(true);
    };

    const stockActualizado = stuff.stock - itemQuantity(stuff.id);

    return (
        <div className="item-detail">
            <h1>Detalle de: {stuff.name}</h1>
            <img alt={stuff.name} src={stuff.img} />
            <p>{stuff.description}</p>
            <p>Stock: {stockActualizado} unidades disponibles</p>
            <p>Precio: ${stuff.price},00</p>
            {purchase 
                ? <div style={{ width: '80%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Link className='btn btn-dark' to='/'>Seguir Comprando</Link>
                        <Link className='btn btn-dark' to='/cart'>Ir al carrito</Link>
                    </div>
                : <ItemCount stock={stockActualizado} onAdd={onAdd} />
            }
        </div>
    );
}

export default ItemDetail;