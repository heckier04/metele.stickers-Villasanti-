import React, { useState, useEffect, useRef } from 'react';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { getOptimizedImageUrl } from '../utils/cloudinaryHelper';
import './stickerSlider.scss';

export default function StickerSlider({ items = null }) {
  const [slides, setSlides] = useState([]);
  const [index, setIndex] = useState(1); // 🔹 arrancamos en 1 porque hay clon al inicio
  const [transition, setTransition] = useState(true);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (items && items.length > 0) {
      const slidesData = items.map(item => ({
        id: item.id,
        image: item.image,
        title: item.title,
        comingSoon: false,
      }));
      setSlides(slidesData);
    } else {
      loadSliderData();
    }
  }, [items]);

  const loadSliderData = async () => {
    try {
      const configSnap = await getDocs(collection(db, 'sliderConfig'));
      if (configSnap.empty) {
        setSlides([]);
        return;
      }

      const config = configSnap.docs[0].data();
      const { currentIds = [], upcomingIds = [] } = config;
      const productsSnap = await getDocs(collection(db, 'productos'));
      const allProducts = productsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      const slidesData = [];

      // 🔧 Los productos reales usan los campos "img" y "name",
      // no "imagen"/"titulo" (esos nunca existieron en el esquema real)
      currentIds.forEach(id => {
        const product = allProducts.find(p => p.id === id);
        if (product) {
          slidesData.push({
            id: product.id,
            image: product.img,
            title: product.name,
            comingSoon: false,
          });
        }
      });

      upcomingIds.forEach(id => {
        const product = allProducts.find(p => p.id === id);
        if (product) {
          slidesData.push({
            id: product.id,
            image: product.img,
            title: product.name,
            comingSoon: true,
          });
        }
      });

      setSlides(slidesData);
    } catch (error) {
      console.error('Error cargando slider:', error);
      setSlides([]);
    }
  };

  // 🔹 extendemos con clones
  const extendedSlides = slides.length > 0
    ? [slides[slides.length - 1], ...slides, slides[0]]
    : [];

  const stopAuto = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  useEffect(() => {
    if (slides.length > 0) {
      const startAuto = () => {
        stopAuto();
        intervalRef.current = setInterval(() => {
          setIndex(i => i + 1);
        }, 3500);
      };
      startAuto();
      return stopAuto;
    }
  }, [slides]);

  // 🔹 lógica de salto invisible
  useEffect(() => {
    if (index === extendedSlides.length - 1) {
      setTimeout(() => {
        setTransition(false);
        setIndex(1);
      }, 0);
    }
    if (index === 0) {
      setTimeout(() => {
        setTransition(false);
        setIndex(slides.length);
      }, 0);
    } else {
      setTransition(true);
    }
  }, [index, extendedSlides.length, slides.length]);

  if (!slides.length) return null;

  return (
    <div
      className="sticker-slider"
      onMouseEnter={stopAuto}
      onMouseLeave={() => {
        if (slides.length > 0) {
          intervalRef.current = setInterval(() => {
            setIndex(i => i + 1);
          }, 3500);
        }
      }}
    >
      <div
        className="sticker-slider__viewport"
        style={{
          transform: `translateX(-${index * 280}px)`,
          transition: transition ? 'transform 0.6s ease' : 'none'
        }}
      >
        {extendedSlides.map((s, i) => (
          <div
            key={s.id || i}
            className={`sticker-slide ${i === index ? 'active' : ''} ${s.comingSoon ? 'coming' : ''}`}
          >
            <img src={getOptimizedImageUrl(s.image, 320)} alt={s.title || 'sticker'} className="sticker-slide__img" />
            <div className="sticker-slide__info">
              <h4>{s.title}</h4>
              {s.comingSoon && <span className="sticker-slide__badge">Próximamente</span>}
            </div>
          </div>
        ))}
      </div>

      <div className="sticker-slider__controls">
        <button className="prev" onClick={() => setIndex(index - 1)} aria-label="Anterior">
          <svg viewBox="0 0 24 24" width="32" height="32" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="#3676ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button className="next" onClick={() => setIndex(index + 1)} aria-label="Siguiente">
          <svg viewBox="0 0 24 24" width="32" height="32" fill="none">
            <path d="M9 6l6 6-6 6" stroke="#3676ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}