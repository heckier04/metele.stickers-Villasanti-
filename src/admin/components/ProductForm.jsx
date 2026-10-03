import React from 'react';

export const ProductForm = ({ product, onSave, onClose }) => {
  const [formData, setFormData] = React.useState(
    product || {
      name: '',
      description: '',
      price: 0,
      stock: 0,
      category: '',
      img: '',
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="product-form-modal">
      <div className="product-form">
        <h3>{product ? 'Editar Producto' : 'Nuevo Producto'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="product-form__group">
            <label>Nombre</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="product-form__group">
            <label>Descripción</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="product-form__row">
            <div className="product-form__group">
              <label>Precio</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                step="0.01"
                required
              />
            </div>
            <div className="product-form__group">
              <label>Stock</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="product-form__group">
            <label>Categoría</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="" disabled>-- Elegí una categoría --</option>
              <option value="animales">Animales</option>
              <option value="anime">Anime</option>
              <option value="deportes">Deportes</option>
              <option value="musica">Música</option>
              <option value="peliculas y series">Películas y series</option>
              <option value="GAMER">GAMER</option>
              <option value="animados">Animados</option>
              <option value="harry potter">Harry Potter</option>
              <option value="argentina">Argentina</option>
              <option value="futbol">Fútbol</option>
              <option value="coronados-gloria">Coronados de Gloria</option>
              <option value="aesthetic">Aesthetic</option>
              <option value="musica-nacional">Música Nacional</option>
              <option value="musica-internacional">Música Internacional</option>
              <option value="MARVEL-DC">MARVEL-DC</option>
              <option value="los simpsons">Los Simpson</option>
              <option value="disney">Disney</option>
              <option value="tornasolados">Tornasolados</option>
              <option value="unicos">Únicos</option>
              <option value="planchitas">Planchitas</option>
            </select>
          </div>

          <div className="product-form__group">
            <label>URL Imagen (Cloudinary)</label>
            <input
              type="url"
              name="img"
              value={formData.img}
              onChange={handleChange}
              placeholder="https://res.cloudinary.com/..."
            />
          </div>

          <div className="product-form__actions">
            <button type="submit" className="product-form__btn-submit">
              Guardar
            </button>
            <button
              type="button"
              onClick={onClose}
              className="product-form__btn-cancel"
            >
              ✕ Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};