import '../sass/NavBar.scss';
import CartWidget from "./CartWidget";
import Spinner from './Spinner';
import { NavLink } from "react-router-dom";
import { useCart } from '../context/CartContext';
import { useState, useEffect } from 'react';

const NavBar = () => {
  const { cartQuantity } = useCart();
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 300); 
    return () => clearTimeout(timer);
  }, [cartQuantity]);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log('Buscar:', searchQuery);
    closeMobileMenu();
  };

  return (
    <nav className='nav-container'>
      {/* Logo */}
      <NavLink to='/' className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
        <img src='/logo-sin-fondo.png' className="logo" alt="Logo de la tienda" />
      </NavLink>

      {/* Desktop Links */}
      <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Inicio</NavLink>
      <NavLink to="/category/nuevos" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Nuevos</NavLink>
      <NavLink to="/category/mas-vendidos" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Más Vendidos</NavLink>
      <NavLink to="/category/ofertas" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
        Ofertas
      </NavLink>

      {/* Cart / Spinner */}
      {loading ? <Spinner type="dual-ring" size="small" /> : <CartWidget />}

      {/* Mobile Toggle */}
      <button className="mobile-toggle" onClick={toggleMobileMenu}>
        ☰
      </button>

      {/* Mobile Navigation */}
      <div className={`mobile-nav ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-nav-wrapper">
          {/* Mobile Search */}
          <form className="mobile-search" onSubmit={handleSearchSubmit}>
            <input 
              type="text" 
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Buscar productos"
            />
          </form>

          {/* Mobile Links */}
          <NavLink to="/" className={({ isActive }) => `mobile-link ${isActive ? 'active' : ''}`} onClick={closeMobileMenu}>Inicio</NavLink>
          <NavLink to="/category/nuevos" className={({ isActive }) => `mobile-link ${isActive ? 'active' : ''}`} onClick={closeMobileMenu}>Nuevos</NavLink>
          <NavLink to="/category/mas-vendidos" className={({ isActive }) => `mobile-link ${isActive ? 'active' : ''}`} onClick={closeMobileMenu}>Más Vendidos</NavLink>
          <NavLink to="/category/ofertas" className={({ isActive }) => `mobile-link ${isActive ? 'active' : ''}`} onClick={closeMobileMenu}>
            <span>Ofertas</span>
            <div className="offer-badge">HOT</div>
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
