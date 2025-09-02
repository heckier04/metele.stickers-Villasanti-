import '../sass/ItemListConteiner.scss';
import { useEffect, useState } from 'react';
import ItemList from './ItemList';
import { useParams } from 'react-router-dom';
import { products } from '../../mocks/AsyncService';
import {addDoc, collection, getDocs, query, where} from 'firebase/firestore'
import { db } from "../../firebase/firebase"
const ItemListContainer = ({ saludo }) => {
    const [data, setData] = useState([]);
    const { category } = useParams();
    
    useEffect(()=>{
        //setLoading(true)
        //ref de mi base de datos
        const productsCollection = category ? query(collection(db, "productos"), where("category", "==", category)) :collection(db, "productos")
        //pedir los documentos
        getDocs(productsCollection)
        //tratamos la promesa
        .then((res)=>{
            //limpiamos y creamos nuestro array de datos
           const list = res.docs.map((doc)=>{
            return{
                id:doc.id,
                ...doc.data()
            }
           })
           setData(list)
        })
        .catch((error)=> console.log(error))
        //.finally(()=> setLoading(false))
    },[category])


// const subirDataFirebase = ()=>{
//     console.log('Click!!!')
//     const collectionProductos = collection(db, 'productos')
//     products.map((prod)=> addDoc(collectionProductos, prod))
//  }

    return (//<button onClick={subirDataFirebase}>Subir Data</button> <-- meter adentro del div de abajo 
        <div>
            
            <h2 className="greeting">{saludo}</h2>
            {data.length > 0 ? <ItemList data={data} /> : <p>No hay productos disponibles</p>}
        </div>
    );
};

export default ItemListContainer;