import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../firebase/firebase';
import './sass/AdminNav.scss';

// Íconos SVG propios, mismo set que el resto del admin
const IconDashboard = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" />
    <rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="16" width="7" height="5" rx="1" />
  </svg>
);
const IconBox = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M21 8 12 3 3 8l9 5 9-5Z" /><path d="M3 8v8l9 5 9-5V8M12 13v8" />
  </svg>
);
const IconWarning = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M12 3 2 20h20L12 3Z" /><path d="M12 10v4M12 17h.01" />
  </svg>
);
const IconGift = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="3" y="8" width="18" height="13" rx="1" /><path d="M3 12h18M12 8v13" />
  </svg>
);
const IconFilm = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="3" y="4" width="18" height="16" rx="1.5" />
    <path d="M7 4v16M17 4v16M3 9h4M3 15h4M17 9h4M17 15h4" />
  </svg>
);
const IconFolder = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />
  </svg>
);
const IconMoney = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="12" cy="12" r="9" /><path d="M9 15c0 1 1 1.5 3 1.5s3-.7 3-1.7c0-2.3-6-1-6-3.3 0-1 1-1.7 3-1.7s3 .5 3 1.5M12 6.5v11" />
  </svg>
);
const IconReceipt = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M5 3h14v18l-2.5-1.5L14 21l-2-1.5L10 21l-2.5-1.5L5 21V3Z" /><path d="M8 8h8M8 12h8M8 16h5" />
  </svg>
);
const IconLogout = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
  </svg>
);

export const AdminNav = ({ currentPage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin', Icon: IconDashboard },
    { label: 'Productos', path: '/admin/gestion-productos', Icon: IconBox },
    { label: 'Stock', path: '/admin/stock', Icon: IconWarning },
    { label: 'Promociones', path: '/admin/promos', Icon: IconGift },
    { label: 'Slider', path: '/admin/slider', Icon: IconFilm },
    { label: 'Organizar Tienda', path: '/admin/organizacion', Icon: IconFolder },
    { label: 'Rentabilidad', path: '/admin/rentabilidad', Icon: IconMoney },
    { label: 'Pedidos', path: '/admin/pedidos', Icon: IconReceipt },
    { label: 'Packs Mayor/Planchitas', path: '/admin/packs', Icon: IconBox },
  ];

  return (
    <>
      <nav className="admin-nav">
        <div className="admin-nav__header">
          <h1 className="admin-nav__title"><IconBox /> Admin Panel</h1>
          <button className="admin-nav__toggle" onClick={() => setIsOpen(!isOpen)}>
            ☰
          </button>
        </div>

        <ul className={`admin-nav__list ${isOpen ? 'active' : ''}`}>
          {navItems.map(({ label, path, Icon }) => (
            <li key={path}>
              <Link
                to={path}
                className={`admin-nav__link ${currentPage === path ? 'active' : ''}`}
                onClick={() => setIsOpen(false)}
              >
                <span className="admin-nav__icon"><Icon /></span>
                <span className="admin-nav__label">{label}</span>
              </Link>
            </li>
          ))}
          <li>
            <button className="admin-nav__logout" onClick={handleLogout}>
              <span className="admin-nav__icon"><IconLogout /></span>
              <span className="admin-nav__label">Cerrar Sesión</span>
            </button>
          </li>
        </ul>
      </nav>
      {isOpen && <div className="admin-nav__overlay" onClick={() => setIsOpen(false)} />}
    </>
  );
};