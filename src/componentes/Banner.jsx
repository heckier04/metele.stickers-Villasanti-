import React, { useState, useEffect } from 'react';
import './banner.scss';

export default function Banner({ images = [], alt = '' }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length > 0) {
      const interval = setInterval(() => {
        setIndex(i => (i + 1) % images.length);
      }, 4000); // cambia cada 2 segundos
      return () => clearInterval(interval);
    }
  }, [images]);

  if (!images.length) return null;

  return (
    <div className="site-banner">
      {images.map((src, i) => (
        <img
          key={i}
          src={src}
          alt={alt}
          className={`site-banner__img ${i === index ? 'active' : ''}`}
        />
      ))}
      
    </div>
  );
}
