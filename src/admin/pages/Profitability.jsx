import { useState, useEffect } from 'react';
import { useAdminProducts } from '../hooks/UseAdminProducts';
import '../sass/Profitability.scss';

const IconChart = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 3v18h18" />
    <path d="M18 17V9M13 17V5M8 17v-4" />
  </svg>
);
const IconBox = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M21 8 12 3 3 8l9 5 9-5Z" />
    <path d="M3 8v8l9 5 9-5V8M12 13v8" />
  </svg>
);
const IconCoin = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="12" cy="12" r="9" />
    <path d="M9.5 9.5c0-1.1 1-2 2.5-2s2.5.7 2.5 1.7c0 2.3-5 1.3-5 3.6 0 1 1 1.7 2.5 1.7s2.5-.9 2.5-2M12 6.5v11" />
  </svg>
);
const IconTag = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M20.4 12.6 11 3.2H3.2v7.8L12.6 20.4a2 2 0 0 0 2.8 0l4.9-5a2 2 0 0 0 0-2.8Z" />
    <circle cx="7" cy="7" r="1" fill="currentColor" stroke="none" />
  </svg>
);
const IconBulb = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.6 10.8c.5.4.8 1 .8 1.7v.5h5.6v-.5c0-.7.3-1.3.8-1.7A6 6 0 0 0 12 3Z" />
  </svg>
);

export const Profitability = () => {
  const { products, getTopSellingProducts } = useAdminProducts();
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getTopSellingProducts();
      setTopProducts(data);
      setLoading(false);
    };
    fetchData();
  }, [getTopSellingProducts]);

  const totalInventory = products.reduce((sum, p) => sum + p.stock, 0);
  const totalProductValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);
  const totalRevenue = topProducts.reduce((sum, p) => sum + (p.estimatedRevenue || 0), 0);

  const lowPerformers = topProducts.filter((p) => p.soldUnits === 0).slice(0, 5);
  const bestSellers = topProducts.filter((p) => p.soldUnits > 0).slice(0, 5);

  return (
    <div className="profitability">
      <div className="profitability__header">
        <h2>Análisis de Rentabilidad</h2>
        <p>Visualizá el desempeño de tus productos y mejorá tus ventas</p>
      </div>

      {/* KPIs principales */}
      <div className="profitability__kpis">
        <div className="profitability__kpi">
          <h3><IconChart /> Ingresos Totales</h3>
          <p className="profitability__kpi-value">${totalRevenue.toLocaleString()}</p>
          <span className="profitability__kpi-label">Estimado de ventas</span>
        </div>
        <div className="profitability__kpi">
          <h3><IconBox /> Inventario Total</h3>
          <p className="profitability__kpi-value">{totalInventory}</p>
          <span className="profitability__kpi-label">Unidades en stock</span>
        </div>
        <div className="profitability__kpi">
          <h3><IconCoin /> Valor del Inventario</h3>
          <p className="profitability__kpi-value">${totalProductValue.toLocaleString()}</p>
          <span className="profitability__kpi-label">Valor total a precio de venta</span>
        </div>
        <div className="profitability__kpi">
          <h3><IconTag /> Productos Activos</h3>
          <p className="profitability__kpi-value">{products.filter((p) => p.active !== false).length}</p>
          <span className="profitability__kpi-label">De {products.length} totales</span>
        </div>
      </div>

      {/* Productos más vendidos */}
      {!loading && (
        <>
          <div className="profitability__section">
            <h3>Top 5 · Más Vendidos</h3>
            {bestSellers.length === 0 ? (
              <p className="profitability__empty">Aún no hay ventas registradas</p>
            ) : (
              <div className="profitability__products-list">
                {bestSellers.map((product, index) => (
                  <div key={product.id} className="profitability__product-card">
                    <span className="profitability__rank">#{index + 1}</span>
                    <img src={product.img} alt={product.name} />
                    <div className="profitability__product-details">
                      <h4>{product.name}</h4>
                      <p className="profitability__category">{product.category}</p>
                      <div className="profitability__stats">
                        <span>Vendidos: {product.soldUnits}</span>
                        <span>Ingresos: ${product.estimatedRevenue || 0}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Productos con bajo rendimiento */}
          <div className="profitability__section profitability__section--low">
            <h3>Productos Sin Vender</h3>
            {lowPerformers.length === 0 ? (
              <p className="profitability__success">Todos tus productos tienen ventas</p>
            ) : (
              <>
                <p className="profitability__low-description">
                  Estos productos aún no tienen ventas. Aquí hay algunas recomendaciones:
                </p>
                <div className="profitability__products-list">
                  {lowPerformers.map((product) => (
                    <div key={product.id} className="profitability__product-card profitability__product-card--low">
                      <img src={product.img} alt={product.name} />
                      <div className="profitability__product-details">
                        <h4>{product.name}</h4>
                        <p className="profitability__category">{product.category}</p>
                        <p className="profitability__price">Precio: ${product.price}</p>
                        <p className="profitability__stock">Stock: {product.stock}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </>
      )}

      {/* Recomendaciones */}
      <div className="profitability__recommendations">
        <h3><IconBulb /> Recomendaciones para Aumentar Ventas</h3>
        <div className="profitability__tips">
          {bestSellers.length > 0 && (
            <div className="profitability__tip">
              <h4>Aumentar precio en bestsellers</h4>
              <p>Considerá subir {bestSellers[0].name} un 10-15%, ya que tiene alta demanda.</p>
            </div>
          )}
          {lowPerformers.length > 0 && (
            <div className="profitability__tip">
              <h4>Crear promoción para productos sin vender</h4>
              <p>Probá con un descuento del 10-20% en {lowPerformers[0].name} para atraer clientes.</p>
            </div>
          )}
          <div className="profitability__tip">
            <h4>Crear packs temáticos</h4>
            <p>Combiná productos de diferentes categorías en packs a precio reducido.</p>
          </div>
          <div className="profitability__tip">
            <h4>Destacar en home</h4>
            <p>Usá la sección "Destacados" para mostrar productos con mejor margen de ganancia.</p>
          </div>
          <div className="profitability__tip">
            <h4>Mejorar imágenes</h4>
            <p>Productos sin vender pueden necesitar fotos más atractivas o mejor descripción.</p>
          </div>
        </div>
      </div>

      {/* Tabla completa */}
      <div className="profitability__table">
        <h3>Análisis Completo de Productos</h3>
        <div className="profitability__table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Vendidos</th>
                <th>Ingresos</th>
                <th>Rendimiento</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((product) => (
                <tr key={product.id}>
                  <td className="profitability__cell-name">
                    <img src={product.img} alt={product.name} />
                    {product.name}
                  </td>
                  <td>{product.category}</td>
                  <td>${product.price}</td>
                  <td>{product.stock}</td>
                  <td>{product.soldUnits}</td>
                  <td>${product.estimatedRevenue || 0}</td>
                  <td>
                    <span className={`profitability__badge ${product.soldUnits > 0 ? 'success' : 'warning'}`}>
                      {product.soldUnits > 0 ? 'Activo' : 'Sin ventas'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};