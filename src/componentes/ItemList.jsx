import Item from "./Item";
import '../sass/Item.scss';

const ItemList = ({ data }) => {
    return (
        <div className="data-list">
            {data.map((prod) => (<Item key={prod.id} prod={prod} />))}

        </div>
    )
}
export default ItemList;