import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import '../sass/SubCategories.scss';

const SubCategories = ({ title, categories }) => {
  return (
    <div className="sub-categories">
      <div className="sub-categories__header">
        <h1>{title}</h1>
        <p>Explora nuestras categorías disponibles</p>
      </div>

      <div className="sub-categories__grid">
        {categories.map((category) => {
          const Icon = category.icon; // el ícono viaja como referencia al componente, no como string

          return (
            <Link
              key={category.path}
              to={category.path}
              className="sub-category-card"
            >
              <div className="sub-category-card__icon">
                <Icon size={26} strokeWidth={2} />
              </div>
              <div className="sub-category-card__content">
                <h3>{category.name}</h3>
                <p>{category.description}</p>
              </div>
              <div className="sub-category-card__arrow">
                <ArrowRight size={20} strokeWidth={2.5} />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default SubCategories;