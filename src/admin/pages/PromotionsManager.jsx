import { useState } from 'react';
import { useAdminProducts } from '../hooks/UseAdminProducts';
import { PromoCard } from '../components/PromoCard';
import '../sass/PromotionsManager.scss';

const IconTag = () => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M20.4 12.6 11 3.2H3.2v7.8L12.6 20.4a2 2 0 0 0 2.8 0l4.9-5a2 2 0 0 0 0-2.8Z" />
    <circle cx="7" cy="7" r="1" fill="currentColor" stroke="none" />
  </svg>
);
const IconPlus = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M12 5v14M5 12h14" />
  </svg>
);
const IconClose = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

const emptyForm = {
  name: '',
  type: 'porcentaje', // porcentaje o monto
  value: 0,
  applicableTo: 'productos', // productos, categoria, tienda
  selectedIds: [],
  startDate: '',
  endDate: '',
  description: '',
};

export const PromotionsManager = () => {
  const { promos, products, createPromo, updatePromo, deletePromo } = useAdminProducts();
  const [showForm, setShowForm] = useState(false);
  const [editingPromo, setEditingPromo] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  const categories = [...new Set(products.map((p) => p.category))];

  const handleEditPromo = (promo) => {
    setEditingPromo(promo);
    setFormData({
      name: promo.name || '',
      type: promo.type || 'porcentaje',
      value: promo.value || 0,
      applicableTo: promo.applicableTo || 'productos',
      selectedIds: promo.selectedIds || [],
      startDate: promo.startDate || '',
      endDate: promo.endDate || '',
      description: promo.description || '',
    });
    setShowForm(true);
  };

  const handleSavePromo = async () => {
    if (!formData.name || !formData.value) {
      alert('Por favor completá todos los campos');
      return;
    }

    if (editingPromo) {
      await updatePromo(editingPromo.id, formData);
    } else {
      await createPromo(formData);
    }
    resetForm();
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingPromo(null);
    setFormData(emptyForm);
  };

  const handleToggleProduct = (productId) => {
    setFormData((prev) => ({
      ...prev,
      selectedIds: prev.selectedIds.includes(productId)
        ? prev.selectedIds.filter((id) => id !== productId)
        : [...prev.selectedIds, productId],
    }));
  };

  return (
    <div className="promos-manager">
      <div className="promos-manager__header">
        <div className="promos-manager__title">
          <IconTag />
          <div>
            <h2>Promociones y Ofertas</h2>
            <p>Creá y gestioná tus campañas de descuentos</p>
          </div>
        </div>
        <button
          className="promos-manager__add-btn"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          <IconPlus /> Nueva Promoción
        </button>
      </div>

      {/* Formulario Modal — usa las clases compartidas product-form-modal / product-form
          (mismo partial que ProductForm y PackForm, ver sass/_shared-modal.scss) */}
      {showForm && (
        <div className="product-form-modal">
          <div className="product-form">
            <h3>{editingPromo ? 'Editar' : 'Nueva'} Promoción</h3>

            <div className="product-form__group">
              <label>Nombre de la Promoción</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ej: Verano 2026"
              />
            </div>

            <div className="product-form__row">
              <div className="product-form__group">
                <label>Tipo de Descuento</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="porcentaje">Porcentaje (%)</option>
                  <option value="monto">Monto Fijo ($)</option>
                </select>
              </div>
              <div className="product-form__group">
                <label>Valor del Descuento</label>
                <input
                  type="number"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) })}
                  placeholder="Ej: 20"
                />
              </div>
            </div>

            <div className="product-form__group">
              <label>Aplicar a...</label>
              <select
                value={formData.applicableTo}
                onChange={(e) => setFormData({ ...formData, applicableTo: e.target.value })}
              >
                <option value="productos">Productos Específicos</option>
                <option value="categoria">Toda una Categoría</option>
                <option value="tienda">Toda la Tienda</option>
              </select>
            </div>

            {formData.applicableTo === 'productos' && (
              <div className="product-form__group">
                <label>
                  Seleccioná Productos
                  <span className="promos-manager__count-badge">{formData.selectedIds.length}</span>
                </label>
                <div className="promos-manager__products-list">
                  {products.map((product) => (
                    <label key={product.id} className="promos-manager__product-check">
                      <input
                        type="checkbox"
                        checked={formData.selectedIds.includes(product.id)}
                        onChange={() => handleToggleProduct(product.id)}
                      />
                      <span>{product.name}</span>
                    </label>
                  ))}
                  {products.length === 0 && (
                    <p className="promos-manager__list-empty">No hay productos cargados.</p>
                  )}
                </div>
              </div>
            )}

            {formData.applicableTo === 'categoria' && (
              <div className="product-form__group">
                <label>Seleccioná Categoría</label>
                <select
                  onChange={(e) => {
                    const catProducts = products
                      .filter((p) => p.category === e.target.value)
                      .map((p) => p.id);
                    setFormData({ ...formData, selectedIds: catProducts });
                  }}
                >
                  <option value="">-- Seleccioná --</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="product-form__row">
              <div className="product-form__group">
                <label>Fecha Inicio</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
              <div className="product-form__group">
                <label>Fecha Fin</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </div>

            <div className="product-form__group">
              <label>Descripción (Opcional)</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detalles de la promoción..."
              />
            </div>

            <div className="product-form__actions">
              <button className="product-form__btn-submit" onClick={handleSavePromo}>
                Guardar Promoción
              </button>
              <button className="product-form__btn-cancel" onClick={resetForm}>
                <IconClose /> Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grid de Promociones */}
      <div className="promos-manager__grid">
        {promos.length === 0 ? (
          <p className="promos-manager__empty">
            No hay promociones creadas todavía. Creá una para aumentar tus ventas.
          </p>
        ) : (
          promos.map((promo) => (
            <PromoCard
              key={promo.id}
              promo={promo}
              onEdit={handleEditPromo}
              onDelete={deletePromo}
              onToggleActive={updatePromo}
            />
          ))
        )}
      </div>
    </div>
  );
};