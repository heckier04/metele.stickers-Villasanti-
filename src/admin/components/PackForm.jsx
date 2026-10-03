import { useState } from 'react';

export const PackForm = ({ pack, onSave, onClose }) => {
  const [formData, setFormData] = useState(
    pack || {
      name: '',
      cantidad: '',
      descripcionCorta: '',
      descripcionLarga: '',
      precio: '',
      precioDetalle: '',
      img: '',
      tipo: 'por-mayor',
      orden: 1,
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="product-form-modal">
      <div className="product-form">
        <h3>{pack ? 'Editar Pack' : 'Nuevo Pack'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="product-form__group">
            <label>Tipo</label>
            <select name="tipo" value={formData.tipo} onChange={handleChange}>
              <option value="por-mayor">Por mayor</option>
              <option value="planchitas">Planchitas</option>
            </select>
          </div>

          <div className="product-form__group">
            <label>Nombre</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Pack Autos 50 unidades"
              required
            />
          </div>

          <div className="product-form__group">
            <label>Cantidad (texto corto)</label>
            <input
              type="text"
              name="cantidad"
              value={formData.cantidad}
              onChange={handleChange}
              placeholder="x50 unidades"
              required
            />
          </div>

          <div className="product-form__group">
            <label>Descripción corta (se ve en la tira)</label>
            <input
              type="text"
              name="descripcionCorta"
              value={formData.descripcionCorta}
              onChange={handleChange}
              placeholder="Vinilo resistente, ideal para reventa"
              required
            />
          </div>

          <div className="product-form__group">
            <label>Descripción larga (se ve al hacer click)</label>
            <textarea
              name="descripcionLarga"
              value={formData.descripcionLarga}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="product-form__row">
            <div className="product-form__group">
              <label>Precio (se ve en la tira)</label>
              <input
                type="text"
                name="precio"
                value={formData.precio}
                onChange={handleChange}
                placeholder="$18.000"
                required
              />
            </div>
            <div className="product-form__group">
              <label>Orden</label>
              <input
                type="number"
                name="orden"
                value={formData.orden}
                onChange={handleChange}
                min="0"
              />
            </div>
          </div>

          <div className="product-form__group">
            <label>Precio detalle (se ve en el modal)</label>
            <input
              type="text"
              name="precioDetalle"
              value={formData.precioDetalle}
              onChange={handleChange}
              placeholder="$18.000 el pack de 50 (equivale a $360 por unidad)"
              required
            />
          </div>

          <div className="product-form__group">
            <label>URL Imagen (Cloudinary)</label>
            <input
              type="url"
              name="img"
              value={formData.img}
              onChange={handleChange}
              placeholder="https://res.cloudinary.com/..."
              required
            />
          </div>

          <div className="product-form__actions">
            <button type="submit" className="product-form__btn-submit">
              Guardar
            </button>
            <button type="button" onClick={onClose} className="product-form__btn-cancel">
              ✕ Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};