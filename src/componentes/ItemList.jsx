import Item from "./Item";
import '../sass/itemList.scss';

const ItemList = ({ data, addToCart }) => {
  return (
    <div className="data-list">
      {data && data.length > 0 ? (
        data.map((prod) => (
          <Item 
            key={prod.id} 
            prod={prod} 
            addToCart={addToCart}
          />
        ))
      ) : (
        <p className="empty">No hay productos disponibles</p>
      )}
    </div>
  );
};

export default ItemList;