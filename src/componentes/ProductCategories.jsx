import React from 'react';
import { Link } from 'react-router-dom';
import { FolderOpen, ShoppingCart, Bookmark, Palette, Store, ArrowRight } from 'lucide-react';
import './ProductCategories.scss';

const ProductCategories = () => {
  const categories = [
    { name: 'Stickers', path: '/categorias', icon: FolderOpen, description: 'Todas las categorías de stickers' },
    { name: 'Por mayor', path: '/category/por-mayor', icon: ShoppingCart, description: 'Stickers al por mayor' },
    { name: 'Planchitas', path: '/category/planchitas', icon: Bookmark, description: 'Stickers en planchas' },
    { name: 'Personalizados', path: '/category/personalizados', icon: Palette, description: 'Diseños a tu pedido' },
  ];

  return (
    <div className="product-categories">
      <div className="product-categories__header">
        <h1>
          <Store size={32} strokeWidth={2.2} className="product-categories__header-icon" />
          Explora Nuestros Productos
        </h1>
        <p>Encuentra tus stickers favoritos por categorías</p>
      </div>

      <div className="product-categories__grid">
        {categories.map((category) => {
          const Icon = category.icon;

          return (
            <Link
              key={category.path}
              to={category.path}
              className="category-card"
            >
              <div className="category-card__icon">
                <Icon size={26} strokeWidth={2} />
              </div>
              <div className="category-card__content">
                <h3>{category.name}</h3>
                <p>{category.description}</p>
              </div>
              <div className="category-card__arrow">
                <ArrowRight size={20} strokeWidth={2.5} />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default ProductCategories;