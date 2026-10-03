import React from 'react';
import SubCategories from '../componentes/SubCategories';

const SpecialProducts = () => {
  // only show the three special sticker categories on the /especiales page
  const specialCategories = [
    { name: 'Tornasolados', path: '/category/tornasolados', icon: '🌈', description: 'Stickers con efecto tornasol' },
    { name: 'Más Vendidos', path: '/category/mas-vendidos', icon: '🔥', description: 'Los stickers más populares' },
    { name: 'Únicos', path: '/category/unicos', icon: '✨', description: 'Diseños exclusivos y únicos' }
  ];

  return (
    <SubCategories
      title="Productos Especiales"
      categories={specialCategories}
    />
  );
};

export default SpecialProducts;