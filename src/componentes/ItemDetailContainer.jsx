import { useEffect, useState } from "react";
import { getProductById } from "../../mocks/AsyncService";
import ItemDetail from "./ItemDetail";
import { useParams } from "react-router-dom";

const ItemDetailContainer = () => {
    const [stuff, setStuff] = useState({});
    const { id } = useParams();

    useEffect(() => {
        getProductById(id) 
            .then((res) => setStuff(res))
            .catch((error) => console.log(error));
    }, [id]);

    if (!stuff || Object.keys(stuff).length === 0) return <p>Cargando...</p>;

    return (
        <>
            <ItemDetail stuff={stuff} />
        </>
    );
};

export default ItemDetailContainer;
