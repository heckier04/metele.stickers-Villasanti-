import { useState, useMemo } from 'react';
import { useAdminProducts } from '../hooks/UseAdminProducts';
import { getOptimizedImageUrl } from '../../utils/cloudinaryHelper';
import '../sass/StockControl.scss';

const CATEGORIAS = [
  'animales', 'anime', 'deportes', 'musica', 'peliculas y series', 'GAMER',
  'animados', 'harry potter', 'argentina', 'futbol', 'coronados-gloria',
  'aesthetic', 'musica-nacional', 'musica-internacional', 'MARVEL-DC',
  'los simpsons', 'disney', 'tornasolados', 'unicos', 'planchitas',
];

const IconWarning = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M12 3 2 20h20L12 3Z" /><path d="M12 10v4M12 17h.01" />
  </svg>
);
const IconAlertCircle = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="9" /><path d="M12 8v5M12 16h.01" />
  </svg>
);
const IconCheck = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="m5 13 4 4L19 7" />
  </svg>
);
const IconSearch = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
  </svg>
);
const IconHistory = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />
  </svg>
);
const IconChevron = ({ open }) => (
  <svg
    viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2"
    style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }}
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const formatCategoria = (cat) => (cat ? cat.charAt(0).toUpperCase() + cat.slice(1) : '—');

const PAGE_SIZE = 20;

export const StockControl = () => {
  const { products, stockHistory, updateStock, lowStockProducts, outOfStockProducts } = useAdminProducts();
  const [showHistory, setShowHistory] = useState(false);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('todas');
  const [statusFilter, setStatusFilter] = useState('todos'); // todos | bajo | sin-stock
  const [page, setPage] = useState(1);

  const categoriesInUse = [...new Set(products.map((p) => p.category).filter(Boolean))];

  const getStockByCategory = (category) =>
    products.filter((p) => p.category === category).reduce((acc, p) => acc + p.stock, 0);

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => categoryFilter === 'todas' || p.category === categoryFilter)
      .filter((p) => {
        if (statusFilter === 'bajo') return p.stock > 0 && p.stock < 3;
        if (statusFilter === 'sin-stock') return p.stock === 0;
        return true;
      })
      .filter((p) => !search.trim() || p.name?.toLowerCase().includes(search.trim().toLowerCase()));
  }, [products, categoryFilter, statusFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const changePage = (setter) => (value) => {
    setter(value);
    setPage(1);
  };

  const toggleStatusFilter = (value) => {
    setStatusFilter((prev) => (prev === value ? 'todos' : value));
    setPage(1);
  };

  const handleStockInputBlur = (product, value) => {
    const newStock = parseInt(value, 10);
    if (isNaN(newStock)) return;
    const change = newStock - product.stock;
    if (change !== 0) updateStock(product.id, change);
  };

  return (
    <div className="stock-control">
      <div className="stock-control__header">
        <div className="stock-control__title">
          <IconWarning />
          <div>
            <h2>Control de Stock</h2>
            <p>Monitoreá tu inventario en tiempo real</p>
          </div>
        </div>
      </div>

      {/* Alertas convertidas en filtros rápidos clickeables */}
      <div className="stock-control__alert-row">
        <button
          className={`stock-control__alert-chip stock-control__alert-chip--critical ${statusFilter === 'sin-stock' ? 'active' : ''}`}
          onClick={() => toggleStatusFilter('sin-stock')}
        >
          <IconAlertCircle /> {outOfStockProducts.length} sin stock
        </button>
        <button
          className={`stock-control__alert-chip stock-control__alert-chip--warning ${statusFilter === 'bajo' ? 'active' : ''}`}
          onClick={() => toggleStatusFilter('bajo')}
        >
          <IconWarning /> {lowStockProducts.length} con stock bajo
        </button>
        {outOfStockProducts.length === 0 && lowStockProducts.length === 0 && (
          <span className="stock-control__alert-chip stock-control__alert-chip--success">
            <IconCheck /> Todo bajo control
          </span>
        )}
      </div>

      {/* Stock por categoría — chips compactos, no tarjetas grandes */}
      <div className="stock-control__categories">
        <h3>Stock por categoría</h3>
        <div className="stock-control__category-chips">
          {categoriesInUse.map((category) => (
            <button
              key={category}
              className={`stock-control__category-chip ${categoryFilter === category ? 'active' : ''}`}
              onClick={() => changePage(setCategoryFilter)(categoryFilter === category ? 'todas' : category)}
            >
              {formatCategoria(category)}
              <span>{getStockByCategory(category)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tabla */}
      <div className="stock-control__table-section">
        <div className="stock-control__table-header">
          <h3>Ajustar Stock</h3>
          <p className="stock-control__count">
            {filteredProducts.length ? (currentPage - 1) * PAGE_SIZE + 1 : 0}–
            {Math.min(currentPage * PAGE_SIZE, filteredProducts.length)} de {filteredProducts.length}
          </p>
        </div>

        <div className="stock-control__filters">
          <div className="stock-control__search">
            <IconSearch />
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={search}
              onChange={(e) => changePage(setSearch)(e.target.value)}
            />
          </div>
          <select value={categoryFilter} onChange={(e) => changePage(setCategoryFilter)(e.target.value)}>
            <option value="todas">Todas las categorías</option>
            {CATEGORIAS.map((cat) => (
              <option key={cat} value={cat}>{formatCategoria(cat)}</option>
            ))}
          </select>
        </div>

        <div className="stock-control__table-wrapper">
          <table className="stock-control__table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Stock</th>
                <th>Ajustar</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.length === 0 && (
                <tr>
                  <td colSpan={4} className="stock-control__empty-list">No hay productos con ese filtro.</td>
                </tr>
              )}
              {paginatedProducts.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className="stock-control__product-info">
                      <img src={getOptimizedImageUrl(product.img, 76)} alt={product.name} className="stock-control__product-img" />
                      <span>{product.name}</span>
                    </div>
                  </td>
                  <td>
                    <span className="stock-control__category-badge">{formatCategoria(product.category)}</span>
                  </td>
                  <td>
                    <span
                      className={`stock-control__amount ${
                        product.stock === 0 ? 'critical' : product.stock < 3 ? 'warning' : 'ok'
                      }`}
                    >
                      {product.stock}
                    </span>
                  </td>
                  <td>
                    <div className="stock-control__controls">
                      <button
                        onClick={() => updateStock(product.id, -1)}
                        className="stock-control__btn"
                        disabled={product.stock === 0}
                      >
                        −
                      </button>
                      <input
                        type="number"
                        defaultValue={product.stock}
                        key={product.stock}
                        onBlur={(e) => handleStockInputBlur(product, e.target.value)}
                        className="stock-control__input"
                      />
                      <button onClick={() => updateStock(product.id, 1)} className="stock-control__btn">
                        +
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="stock-control__pagination">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>← Anterior</button>
            <span>Página {currentPage} de {totalPages}</span>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Siguiente →</button>
          </div>
        )}
      </div>

      {/* Historial */}
      <div className="stock-control__history">
        <button className="stock-control__btn-history" onClick={() => setShowHistory(!showHistory)}>
          <IconHistory /> Historial de Cambios
          <IconChevron open={showHistory} />
        </button>
        {showHistory && (
          <div className="stock-control__history-list">
            {stockHistory.length === 0 && <p className="stock-control__empty-list">Sin movimientos todavía.</p>}
            {stockHistory.slice(0, 20).map((record) => (
              <div key={record.id} className="stock-control__history-item">
                <span className="stock-control__history-date">
                  {new Date(record.timestamp.toDate()).toLocaleDateString('es-AR')}
                </span>
                <span className="stock-control__history-product">{record.productName}</span>
                <span className={`stock-control__history-change ${record.type}`}>
                  {record.type === 'entrada' ? '+' : '−'} {Math.abs(record.change)}
                </span>
                <span className="stock-control__history-result">
                  {record.previousStock} → {record.newStock}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};