import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useAdminProducts } from '../hooks/UseAdminProducts';
import { AdminContext } from '../context/AdminContextValue';
import '../sass/AdminHome.scss';

// Íconos SVG propios, sin librerías externas
const IconBox = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M21 8 12 3 3 8l9 5 9-5Z" /><path d="M3 8v8l9 5 9-5V8M12 13v8" />
  </svg>
);
const IconGift = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="3" y="8" width="18" height="13" rx="1" /><path d="M3 12h18M12 8v13" />
  </svg>
);
const IconWarning = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M12 3 2 20h20L12 3Z" /><path d="M12 10v4M12 17h.01" />
  </svg>
);
const IconAlertCircle = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="12" cy="12" r="9" /><path d="M12 8v5M12 16h.01" />
  </svg>
);
const IconFolder = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />
  </svg>
);
const IconMoney = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="12" cy="12" r="9" /><path d="M9 15c0 1 1 1.5 3 1.5s3-.7 3-1.7c0-2.3-6-1-6-3.3 0-1 1-1.7 3-1.7s3 .5 3 1.5M12 6.5v11" />
  </svg>
);
const IconReceipt = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M5 3h14v18l-2.5-1.5L14 21l-2-1.5L10 21l-2.5-1.5L5 21V3Z" /><path d="M8 8h8M8 12h8M8 16h5" />
  </svg>
);
const IconFilm = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="3" y="4" width="18" height="16" rx="1.5" />
    <path d="M7 4v16M17 4v16M3 9h4M3 15h4M17 9h4M17 15h4" />
  </svg>
);
const IconArrow = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
const IconDownload = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M12 3v12m0 0-4-4m4 4 4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
  </svg>
);
const IconTrash = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M4 7h16M9 7V4h6v3m-8 0 1 13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1l1-13" />
  </svg>
);

const quickLinks = [
  { to: '/admin/gestion-productos', title: 'Productos', desc: 'Editá precios, stock y categorías', Icon: IconBox },
  { to: '/admin/stock', title: 'Control de Stock', desc: 'Monitoreá inventario y alertas', Icon: IconWarning },
  { to: '/admin/promos', title: 'Promociones', desc: 'Lanzá ofertas y descuentos', Icon: IconGift },
  { to: '/admin/slider', title: 'Slider', desc: 'Elegí qué se muestra en la home', Icon: IconFilm },
  { to: '/admin/organizacion', title: 'Organizar Tienda', desc: 'Ordená productos por secciones', Icon: IconFolder },
  { to: '/admin/rentabilidad', title: 'Rentabilidad', desc: 'Analizá ventas y ganancias', Icon: IconMoney },
  { to: '/admin/pedidos', title: 'Pedidos', desc: 'Confirmá pagos y gestioná órdenes', Icon: IconReceipt },
  { to: '/admin/packs', title: 'Packs Mayor/Planchitas', desc: 'Creá y editá packs de venta por mayor', Icon: IconBox },
];

export const AdminHome = () => {
  const { products, promos, lowStockProducts, outOfStockProducts } = useAdminProducts();
  const { deleteAllData, importMockProducts, importMockPacksPorMayor, importMockPacksPlanchitas } =
    useContext(AdminContext);

  const [metrics, setMetrics] = useState({ totalProducts: 0, activePromos: 0, lowStock: 0, outOfStock: 0 });

  useEffect(() => {
    setMetrics({
      totalProducts: products.length,
      activePromos: promos.filter((p) => p.active).length,
      lowStock: lowStockProducts.length,
      outOfStock: outOfStockProducts.length,
    });
  }, [products, promos, lowStockProducts, outOfStockProducts]);

  return (
    <div className="admin-home">
      <header className="admin-home__header">
        <h1>Panel de Administración</h1>
        <p>Gestioná tu tienda de stickers de forma visual y sencilla</p>
      </header>

      {/* Métricas */}
      <div className="admin-home__metrics">
        <div className="admin-home__metric">
          <span className="admin-home__metric-icon admin-home__metric-icon--primary"><IconBox /></span>
          <div>
            <p className="admin-home__metric-value">{metrics.totalProducts}</p>
            <span className="admin-home__metric-label">Productos en catálogo</span>
          </div>
        </div>

        <div className="admin-home__metric">
          <span className="admin-home__metric-icon admin-home__metric-icon--success"><IconGift /></span>
          <div>
            <p className="admin-home__metric-value">{metrics.activePromos}</p>
            <span className="admin-home__metric-label">Promociones activas</span>
          </div>
        </div>

        <div className="admin-home__metric">
          <span className="admin-home__metric-icon admin-home__metric-icon--warning"><IconWarning /></span>
          <div>
            <p className="admin-home__metric-value">{metrics.lowStock}</p>
            <span className="admin-home__metric-label">Con stock bajo</span>
          </div>
        </div>

        <div className="admin-home__metric">
          <span className="admin-home__metric-icon admin-home__metric-icon--critical"><IconAlertCircle /></span>
          <div>
            <p className="admin-home__metric-value">{metrics.outOfStock}</p>
            <span className="admin-home__metric-label">Sin stock</span>
          </div>
        </div>
      </div>

      {/* Accesos rápidos */}
      <section className="admin-home__section">
        <h2>Accesos rápidos</h2>
        <div className="admin-home__grid">
          {quickLinks.map(({ to, title, desc, Icon }) => (
            <Link key={to} to={to} className="admin-home__card">
              <span className="admin-home__card-icon"><Icon /></span>
              <div className="admin-home__card-text">
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
              <span className="admin-home__card-arrow"><IconArrow /></span>
            </Link>
          ))}
        </div>
      </section>

      {/* Acciones de datos: separadas de la navegación normal, porque son masivas/destructivas */}
      <section className="admin-home__section">
        <h2>Datos y utilidades</h2>
        <div className="admin-home__utility-row">
          <div className="admin-home__utility-card">
            <div>
              <h4><IconDownload /> Importar Productos del Mock</h4>
              <p>Agrega los productos de ejemplo a Firebase</p>
            </div>
            <button onClick={importMockProducts} className="admin-home__utility-btn">Importar</button>
          </div>

          <div className="admin-home__utility-card">
            <div>
              <h4><IconDownload /> Importar Packs "Por mayor"</h4>
              <p>Agrega los packs de venta por mayor desde el mock</p>
            </div>
            <button onClick={importMockPacksPorMayor} className="admin-home__utility-btn">Importar</button>
          </div>

          <div className="admin-home__utility-card">
            <div>
              <h4><IconDownload /> Importar Packs "Planchitas"</h4>
              <p>Agrega los packs de planchitas desde el mock</p>
            </div>
            <button onClick={importMockPacksPlanchitas} className="admin-home__utility-btn">Importar</button>
          </div>

          <div className="admin-home__utility-card admin-home__utility-card--danger">
            <div>
              <h4><IconTrash /> Borrar Todos los Productos</h4>
              <p>Elimina todos los productos de Firebase. No se puede deshacer.</p>
            </div>
            <button
              onClick={() => {
                if (window.confirm('¿Seguro que querés borrar TODOS los productos? Esta acción no se puede deshacer.')) {
                  deleteAllData();
                }
              }}
              className="admin-home__utility-btn admin-home__utility-btn--danger"
            >
              Borrar
            </button>
          </div>
        </div>
      </section>

      {/* Tips */}
      <section className="admin-home__section">
        <h2>Tips para vender más</h2>
        <div className="admin-home__tips">
          {[
            { n: 1, title: 'Mantené el stock actualizado', desc: 'Revisá el control de stock cada semana' },
            { n: 2, title: 'Creá promociones estratégicas', desc: 'Usá descuentos para productos con menos rotación' },
            { n: 3, title: 'Destacá tus bestsellers', desc: 'Marcá como "Destacado" tus productos más vendidos' },
            { n: 4, title: 'Organizá por categorías', desc: 'Facilitá que los clientes encuentren lo que buscan' },
          ].map((tip) => (
            <div key={tip.n} className="admin-home__tip">
              <span className="admin-home__tip-number">{tip.n}</span>
              <div>
                <h4>{tip.title}</h4>
                <p>{tip.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};