import '../sass/ItemListConteiner.scss';
import { useEffect, useState } from 'react';
import ItemList from './ItemList';
import { useParams } from 'react-router-dom';
import { getProducts } from '../../mocks/AsyncService';

const ItemListContainer = ({ saludo }) => {
    const [data, setData] = useState([]);
    const { category } = useParams();

    useEffect(() => {
        getProducts()
            .then((res) => {
                if (category) {
                    setData(res.filter((prod) => prod.category === category));
                } else {
                    setData(res);
                }
            })
            .catch((error) => console.log(error));
    }, [category]);

    return (
        <div>
            <h2 className="greeting">{saludo}</h2>
            {data.length > 0 ? <ItemList data={data} /> : <p>No hay productos disponibles</p>}
        </div>
    );
};

export default ItemListContainer;