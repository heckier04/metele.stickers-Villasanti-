import { useState, useMemo } from 'react';
import { useAdminProducts } from '../hooks/UseAdminProducts';
import { ProductTable } from '../components/ProductTable';
import { ProductForm } from '../components/ProductForm';
import '../sass/ProductsManagement.scss';

const CATEGORIAS = [
  'animales', 'anime', 'deportes', 'musica', 'peliculas y series', 'GAMER',
  'animados', 'harry potter', 'argentina', 'futbol', 'coronados-gloria',
  'aesthetic', 'musica-nacional', 'musica-internacional', 'MARVEL-DC',
  'los simpsons', 'disney', 'tornasolados', 'unicos', 'planchitas',
];

const IconPlus = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M12 5v14M5 12h14" />
  </svg>
);
const IconBox = () => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M21 8 12 3 3 8l9 5 9-5Z" />
    <path d="M3 8v8l9 5 9-5V8M12 13v8" />
  </svg>
);
const IconSearch = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

const PAGE_SIZE = 20;

export const ProductsManagement = () => {
  const { products, updateProduct, updateStock, updatePrice, toggleProductActive, updateCategory, createProduct } =
    useAdminProducts();
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [filter, setFilter] = useState('todos');
  const [categoryFilter, setCategoryFilter] = useState('todas');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (filter === 'activos') return p.active !== false;
        if (filter === 'inactivos') return p.active === false;
        if (filter === 'sin-stock') return p.stock === 0;
        return true;
      })
      .filter((p) => categoryFilter === 'todas' || p.category === categoryFilter)
      .filter((p) => !search.trim() || p.name?.toLowerCase().includes(search.trim().toLowerCase()));
  }, [products, filter, categoryFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleFilterChange = (setter) => (e) => {
    setter(e.target.value);
    setPage(1); // volvemos a la página 1 cada vez que cambia un filtro
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleSaveProduct = (productData) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
    } else {
      createProduct(productData);
    }
    handleCloseForm();
  };

  return (
    <div className="products-management">
      <div className="products-management__header">
        <div className="products-management__title">
          <IconBox />
          <div>
            <h2>Gestión de Productos</h2>
            <p>Administrá tus stickers, precios y disponibilidad</p>
          </div>
        </div>
        <button onClick={() => setShowForm(true)} className="products-management__add-btn">
          <IconPlus /> Nuevo Producto
        </button>
      </div>

      <div className="products-management__controls">
        <div className="products-management__search">
          <IconSearch />
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={search}
            onChange={handleFilterChange(setSearch)}
          />
        </div>

        <div className="products-management__filters">
          <select value={filter} onChange={handleFilterChange(setFilter)} className="products-management__select">
            <option value="todos">Todos ({products.length})</option>
            <option value="activos">Activos ({products.filter((p) => p.active !== false).length})</option>
            <option value="inactivos">Inactivos ({products.filter((p) => p.active === false).length})</option>
            <option value="sin-stock">Sin stock ({products.filter((p) => p.stock === 0).length})</option>
          </select>

          <select value={categoryFilter} onChange={handleFilterChange(setCategoryFilter)} className="products-management__select">
            <option value="todas">Todas las categorías</option>
            {CATEGORIAS.map((cat) => (
              <option key={cat} value={cat}>
                {cat} ({products.filter((p) => p.category === cat).length})
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="products-management__count">
        Mostrando {paginatedProducts.length ? (currentPage - 1) * PAGE_SIZE + 1 : 0}–
        {Math.min(currentPage * PAGE_SIZE, filteredProducts.length)} de {filteredProducts.length}
      </p>

      <ProductTable
        products={paginatedProducts}
        onEditProduct={handleEditProduct}
        onStockChange={updateStock}
        onPriceChange={updatePrice}
        onToggleActive={toggleProductActive}
        onCategoryChange={updateCategory}
      />

      {totalPages > 1 && (
        <div className="products-management__pagination">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>
            ← Anterior
          </button>
          <span>Página {currentPage} de {totalPages}</span>
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
            Siguiente →
          </button>
        </div>
      )}

      {showForm && (
        <ProductForm product={editingProduct} onSave={handleSaveProduct} onClose={handleCloseForm} />
      )}
    </div>
  );
};