import { useContext, useState, useEffect, useMemo } from 'react';
import { AdminContext } from '../context/AdminContextValue';
import { getOptimizedImageUrl } from '../../utils/cloudinaryHelper';
import '../sass/SliderManager.scss';

const CATEGORIAS = [
  'animales', 'anime', 'deportes', 'musica', 'peliculas y series', 'GAMER',
  'animados', 'harry potter', 'argentina', 'futbol', 'coronados-gloria',
  'aesthetic', 'musica-nacional', 'musica-internacional', 'MARVEL-DC',
  'los simpsons', 'disney', 'tornasolados', 'unicos', 'planchitas',
];

const IconSlider = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="3" y="7" width="18" height="10" rx="2" /><path d="M8 7v10M16 7v10" />
  </svg>
);
const IconCheck = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);
const IconSearch = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
  </svg>
);

export const SliderManager = () => {
  const { products, sliderConfig, updateSliderConfig } = useContext(AdminContext);
  const [currentIds, setCurrentIds] = useState([]);
  const [upcomingIds, setUpcomingIds] = useState([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('todas');

  useEffect(() => {
    if (sliderConfig) {
      setCurrentIds(sliderConfig.currentIds || []);
      setUpcomingIds(sliderConfig.upcomingIds || []);
    }
  }, [sliderConfig]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => categoryFilter === 'todas' || p.category === categoryFilter)
      .filter((p) => !search.trim() || p.name?.toLowerCase().includes(search.trim().toLowerCase()));
  }, [products, categoryFilter, search]);

  const toggleCurrent = (id) => {
    setCurrentIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const toggleUpcoming = (id) => {
    setUpcomingIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const handleSave = async () => {
    setSaving(true);
    await updateSliderConfig(currentIds, upcomingIds);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const renderProductGrid = (selectedIds, onToggle, variant) => (
    <div className="slider-manager__grid">
      {filteredProducts.map((product) => {
        const isSelected = selectedIds.includes(product.id);
        return (
          <button
            type="button"
            key={product.id}
            className={`slider-manager__product ${isSelected ? 'slider-manager__product--selected' : ''} slider-manager__product--${variant}`}
            onClick={() => onToggle(product.id)}
            title={product.name}
          >
            <div className="slider-manager__thumb">
              {product.img && <img src={getOptimizedImageUrl(product.img, 220)} alt={product.name} />}
              {isSelected && (
                <span className="slider-manager__check">
                  <IconCheck />
                </span>
              )}
            </div>
            <span className="slider-manager__product-name">{product.name}</span>
          </button>
        );
      })}
      {filteredProducts.length === 0 && (
        <p className="slider-manager__empty">No hay productos con ese filtro.</p>
      )}
    </div>
  );

  return (
    <div className="slider-manager">
      <div className="slider-manager__header">
        <div className="slider-manager__title">
          <IconSlider />
          <div>
            <h2>Gestionar Slider de Stickers</h2>
            <p>Elegí qué productos se muestran en el slider principal de la home</p>
          </div>
        </div>

        <div className="slider-manager__save-area">
          <button onClick={handleSave} className="slider-manager__save" disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar Configuración'}
          </button>
          {saved && (
            <p className="slider-manager__success">
              <IconCheck /> Guardado
            </p>
          )}
        </div>
      </div>

      {/* Buscador + filtro, compartido por las dos secciones */}
      <div className="slider-manager__filters">
        <div className="slider-manager__search">
          <IconSearch />
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="todas">Todas las categorías</option>
          {CATEGORIAS.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="slider-manager__sections">
        <section className="slider-manager__section">
          <div className="slider-manager__section-header">
            <h3>Stickers Actuales</h3>
            <span className="slider-manager__badge">{currentIds.length} seleccionados</span>
          </div>
          {renderProductGrid(currentIds, toggleCurrent, 'current')}
        </section>

        <section className="slider-manager__section">
          <div className="slider-manager__section-header">
            <h3>Stickers Próximos</h3>
            <span className="slider-manager__badge slider-manager__badge--upcoming">{upcomingIds.length} seleccionados</span>
          </div>
          {renderProductGrid(upcomingIds, toggleUpcoming, 'upcoming')}
        </section>
      </div>
    </div>
  );
};