import { getOptimizedImageUrl } from '../../utils/cloudinaryHelper';

const IconEdit = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </svg>
);
const IconCheck = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="m5 13 4 4L19 7" />
  </svg>
);
const IconX = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

const formatCategoria = (cat) => (cat ? cat.charAt(0).toUpperCase() + cat.slice(1) : '—');

export const ProductTable = ({
  products,
  onEditProduct,
  onStockChange,
  onPriceChange,
  onToggleActive,
  onCategoryChange,
}) => {
  const categories = [
    'animales', 'anime', 'deportes', 'musica', 'peliculas y series', 'GAMER',
    'animados', 'harry potter', 'argentina', 'futbol', 'coronados-gloria',
    'aesthetic', 'musica-nacional', 'musica-internacional', 'MARVEL-DC',
    'los simpsons', 'disney', 'tornasolados', 'unicos', 'planchitas',
  ];

  return (
    <div className="product-table">
      <table>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Categoría</th>
            <th>Estado</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 && (
            <tr>
              <td colSpan={6} className="product-table__empty">No hay productos con ese filtro.</td>
            </tr>
          )}
          {products.map((product) => (
            <tr key={product.id} className="product-table__row">
              <td className="product-table__product">
                <img src={getOptimizedImageUrl(product.img, 80)} alt={product.name} />
                <span title={product.name}>{product.name}</span>
              </td>
              <td>
                <div className="product-table__price-field">
                  <span>$</span>
                  <input
                    type="number"
                    defaultValue={product.price}
                    key={product.price}
                    onBlur={(e) => {
                      const value = parseFloat(e.target.value);
                      if (!isNaN(value) && value !== product.price) onPriceChange(product.id, value);
                    }}
                    className="product-table__input product-table__input--price"
                  />
                </div>
              </td>
              <td>
                <div className="product-table__stock-control">
                  <button
                    onClick={() => onStockChange(product.id, -1)}
                    disabled={product.stock === 0}
                    className="product-table__btn product-table__btn--small"
                  >
                    −
                  </button>
                  <span
                    className={`product-table__stock-value ${
                      product.stock === 0 ? 'critical' : product.stock < 3 ? 'warning' : 'ok'
                    }`}
                  >
                    {product.stock}
                  </span>
                  <button
                    onClick={() => onStockChange(product.id, 1)}
                    className="product-table__btn product-table__btn--small"
                  >
                    +
                  </button>
                </div>
              </td>
              <td>
                <select
                  value={product.category || ''}
                  onChange={(e) => onCategoryChange(product.id, e.target.value)}
                  className="product-table__select"
                >
                  <option value="">Sin categoría</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{formatCategoria(cat)}</option>
                  ))}
                </select>
              </td>
              <td>
                <button
                  onClick={() => onToggleActive(product.id)}
                  className={`product-table__status ${product.active !== false ? 'active' : 'inactive'}`}
                  title={product.active !== false ? 'Activo' : 'Inactivo'}
                >
                  {product.active !== false ? <IconCheck /> : <IconX />}
                  {product.active !== false ? 'Activo' : 'Inactivo'}
                </button>
              </td>
              <td>
                <button onClick={() => onEditProduct(product)} className="product-table__btn-edit">
                  <IconEdit /> Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};