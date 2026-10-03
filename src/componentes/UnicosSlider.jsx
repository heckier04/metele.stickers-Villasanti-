import { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from "../../firebase/firebase";
import { getOptimizedImageUrl } from '../utils/cloudinaryHelper';
import StickerSlider from './StickerSlider';
import './stickerSlider.scss';

export default function UnicosSlider() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchUnicos = async () => {
      try {
        const q = query(collection(db, "productos"), where("category", "==", "unicos"));
        const snapshot = await getDocs(q);
        const list = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            image: getOptimizedImageUrl(data.img, 320),
            title: data.name,
          };
        });
        setItems(list);
      } catch (error) {
        console.error("Error cargando únicos:", error);
      }
    };

    fetchUnicos();
  }, []);

  return (
    <div className="slider-section">
      <h2>Únicos</h2>
      <StickerSlider items={items} />
    </div>
  );
}