import { useState, useMemo } from 'react';
import { useAdminProducts } from '../hooks/UseAdminProducts';
import { getOptimizedImageUrl } from '../../utils/cloudinaryHelper';
import '../sass/StoreOrganization.scss';

const CATEGORIAS = [
  'animales', 'anime', 'deportes', 'musica', 'peliculas y series', 'GAMER',
  'animados', 'harry potter', 'argentina', 'futbol', 'coronados-gloria',
  'aesthetic', 'musica-nacional', 'musica-internacional', 'MARVEL-DC',
  'los simpsons', 'disney', 'tornasolados', 'unicos', 'planchitas',
];

const IconFolder = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />
  </svg>
);
const IconSearch = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
  </svg>
);
const IconSparkle = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M12 2l1.8 5.6L19 9.5l-5.2 1.9L12 17l-1.8-5.6L5 9.5l5.2-1.9L12 2z" />
  </svg>
);
const IconStar = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M12 2l3 6.5 7 .9-5.2 4.8L18.2 21 12 17.3 5.8 21l1.4-6.8L2 9.4l7-.9L12 2z" />
  </svg>
);
const IconGift = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="3" y="8" width="18" height="13" rx="1" />
    <path d="M3 12h18M12 8v13M12 8c-1.5-3-5-4-5-1.5S9 8 12 8Zm0 0c1.5-3 5-4 5-1.5S15 8 12 8Z" />
  </svg>
);
const IconBox = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M21 8 12 3 3 8l9 5 9-5Z" /><path d="M3 8v8l9 5 9-5V8M12 13v8" />
  </svg>
);
const IconFlame = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M12 2c1 3-2 4-2 7a4 4 0 0 0 8 0c0-1-.3-2-1-3 2 1 3 3.5 3 6a6 6 0 0 1-12 0c0-4 2-6 4-10Z" />
  </svg>
);
const IconDrag = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
    <circle cx="9" cy="6" r="1.4" /><circle cx="15" cy="6" r="1.4" />
    <circle cx="9" cy="12" r="1.4" /><circle cx="15" cy="12" r="1.4" />
    <circle cx="9" cy="18" r="1.4" /><circle cx="15" cy="18" r="1.4" />
  </svg>
);

const sectionConfig = {
  nuevos: { title: 'Nuevos', description: 'Últimos agregados', color: 'var(--admin-primary)', Icon: IconSparkle },
  destacados: { title: 'Destacados', description: 'Para que todos vean', color: '#f59e0b', Icon: IconStar },
  promos: { title: 'En Promoción', description: 'Con ofertas activas', color: 'var(--admin-success)', Icon: IconGift },
  packs: { title: 'Packs Especiales', description: 'Combos de unidades', color: '#7c3aed', Icon: IconBox },
  bestsellers: { title: 'Más Vendidos', description: 'Los favoritos', color: 'var(--admin-critical)', Icon: IconFlame },
};

export const StoreOrganization = () => {
  const { products, updateProduct } = useAdminProducts();
  const [draggedProduct, setDraggedProduct] = useState(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('todas');

  // Las secciones se calculan directo desde Firestore (product.section)
  const sections = useMemo(() => {
    const grouped = {};
    Object.keys(sectionConfig).forEach((key) => {
      grouped[key] = products.filter((p) => p.section === key);
    });
    return grouped;
  }, [products]);

  const filtrar = (list) =>
    list
      .filter((p) => categoryFilter === 'todas' || p.category === categoryFilter)
      .filter((p) => !search.trim() || p.name?.toLowerCase().includes(search.trim().toLowerCase()));

  const availableProducts = useMemo(
    () => filtrar(products.filter((p) => !p.section)),
    [products, categoryFilter, search]
  );

  const handleDragStart = (e, product) => {
    setDraggedProduct(product);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDropSection = (e, sectionName) => {
    e.preventDefault();
    if (!draggedProduct) return;
    updateProduct(draggedProduct.id, { section: sectionName });
    setDraggedProduct(null);
  };

  const handleRemove = (product) => {
    updateProduct(product.id, { section: null });
  };

  const handleToggleFeatured = (productId) => {
    const product = products.find((p) => p.id === productId);
    updateProduct(productId, { featured: !product.featured });
  };

  return (
    <div className="store-organization">
      <div className="store-organization__header">
        <div className="store-organization__title">
          <IconFolder />
          <div>
            <h2>Organizar Tienda</h2>
            <p>Elegí qué productos aparecen en cada sección de la home</p>
          </div>
        </div>
      </div>

      {/* Instrucciones visuales, no solo texto */}
      <div className="store-organization__steps">
        <div className="store-organization__step">
          <span className="store-organization__step-num">1</span>
          <span>Buscá el producto en la lista de la izquierda</span>
        </div>
        <span className="store-organization__step-arrow">→</span>
        <div className="store-organization__step">
          <span className="store-organization__step-num">2</span>
          <span>Arrastralo y soltalo dentro de la sección que quieras</span>
        </div>
        <span className="store-organization__step-arrow">→</span>
        <div className="store-organization__step">
          <span className="store-organization__step-num">3</span>
          <span>Listo — ya se guardó solo</span>
        </div>
      </div>

      {/* Buscador + filtro, compartido por la lista y la tabla de abajo */}
      <div className="store-organization__filters">
        <div className="store-organization__search">
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

      <div className="store-organization__layout">
        {/* Productos sin sección asignada */}
        <div className="store-organization__available">
          <h3>Sin asignar</h3>
          <p className="store-organization__count">
            {availableProducts.length} de {products.filter((p) => !p.section).length} productos
          </p>
          <div className="store-organization__products-list">
            {availableProducts.length === 0 && (
              <p className="store-organization__empty-list">No hay productos con ese filtro.</p>
            )}
            {availableProducts.map((product) => (
              <div
                key={product.id}
                draggable
                onDragStart={(e) => handleDragStart(e, product)}
                className="store-organization__product-item"
              >
                <img src={getOptimizedImageUrl(product.img, 70)} alt={product.name} />
                <div className="store-organization__product-info">
                  <h4>{product.name}</h4>
                  <p>${product.price}</p>
                </div>
                <span className="store-organization__drag-hint"><IconDrag /></span>
              </div>
            ))}
          </div>
        </div>

        {/* Secciones */}
        <div className="store-organization__sections">
          {Object.entries(sectionConfig).map(([sectionKey, config]) => {
            const { Icon } = config;
            return (
              <div
                key={sectionKey}
                className="store-organization__section"
                style={{ '--section-color': config.color }}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDropSection(e, sectionKey)}
              >
                <div className="store-organization__section-header">
                  <h3><Icon /> {config.title}</h3>
                  <p>{config.description}</p>
                  <span className="store-organization__badge">
                    {sections[sectionKey]?.length || 0}
                  </span>
                </div>

                <div className="store-organization__section-content">
                  {sections[sectionKey]?.length === 0 ? (
                    <div className="store-organization__empty">Soltá productos acá</div>
                  ) : (
                    sections[sectionKey].map((product, index) => (
                      <div key={product.id} className="store-organization__section-item">
                        <span className="store-organization__order">#{index + 1}</span>
                        <img src={getOptimizedImageUrl(product.img, 68)} alt={product.name} />
                        <div className="store-organization__item-info">
                          <h4>{product.name}</h4>
                          <p>${product.price}</p>
                        </div>
                        <button
                          className="store-organization__btn-remove"
                          onClick={() => handleRemove(product)}
                        >
                          ✕
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabla de destacados */}
      <div className="store-organization__features">
        <h3><IconStar /> Marcar como Destacado</h3>
        <div className="store-organization__features-table">
          {filtrar(products).length === 0 && (
            <p className="store-organization__empty-list">No hay productos con ese filtro.</p>
          )}
          {filtrar(products).map((product) => (
            <div key={product.id} className="store-organization__feature-row">
              <div className="store-organization__feature-info">
                <img src={getOptimizedImageUrl(product.img, 76)} alt={product.name} />
                <h4>{product.name}</h4>
              </div>
              <div className="store-organization__feature-toggles">
                <button
                  className={`store-organization__toggle ${product.featured ? 'active' : ''}`}
                  onClick={() => handleToggleFeatured(product.id)}
                  title="Marcar como destacado"
                >
                  <IconStar /> Destacado
                </button>
                <span className="store-organization__feature-category">{product.category}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};