import { useEffect, useState } from "react";
import ItemDetail from "./ItemDetail";
import Spinner from "./Spinner";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";

const ItemDetailContainer = () => {
  const [stuff, setStuff] = useState({});
  const [cargando, setCargando] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    setCargando(true);
    const docRef = doc(db, "productos", id);

    getDoc(docRef)
      .then((res) => {
        if (res.exists()) {
          setStuff({ id: res.id, ...res.data() });
        } else {
          navigate("/notFound"); 
        }
      })
      .catch((error) => console.log(error))
      .finally(() => setCargando(false));
  }, [id, navigate]);

  if (cargando) return <Spinner fullscreen type="dual-ring" />; 
  if (!stuff || Object.keys(stuff).length === 0) return <p>Producto no encontrado</p>;

  return <ItemDetail stuff={stuff} />;
};

export default ItemDetailContainer;
