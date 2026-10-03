import CartWidget from "./CartWidget";
import Spinner from './Spinner';
import { NavLink } from "react-router-dom";
import { useCart } from '../context/CartContextValue';
import { useState, useEffect } from 'react';
import '../sass/NavBar.scss';
const NavBar = () => {
  const { cartQuantity } = useCart();
  const [loading, setLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 300); 
    return () => clearTimeout(timer);
  }, [cartQuantity]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`nav-container ${isScrolled ? 'scrolled' : ''}`}>
      {/* Links izquierda */}
      <ul className="nav-links left">
        <li>
          <NavLink to="/" className="nav-link">Inicio</NavLink>
        </li>
        <li className="dropdown">
          <NavLink to="/especiales" className="nav-link">Especiales</NavLink>
          <ul className="dropdown-menu">
            <li><NavLink to="/category/tornasolados">Tornasolados</NavLink></li>
            <li><NavLink to="/category/mas-vendidos">Más Vendidos</NavLink></li>
            <li><NavLink to="/category/unicos">Únicos</NavLink></li>
          </ul>
        </li>
        <li className="dropdown">
          <NavLink to="/productos" className="nav-link">Productos</NavLink>
          <ul className="dropdown-menu">
            <li className="dropdown">
              <NavLink to="/categorias" className="nav-link">Stickers  </NavLink>
              <ul className="dropdown-menu">
                <li><NavLink to="/category/animales">Animales</NavLink></li>
                <li><NavLink to="/category/anime">Anime</NavLink></li>
                <li><NavLink to="/category/deportes">Deportes</NavLink></li>
                <li><NavLink to="/category/musica">Música</NavLink></li>
                <li><NavLink to="/category/peliculas y series">peliculas y series</NavLink></li>
                <li><NavLink to="/category/GAMER">GAMER</NavLink></li>
                <li><NavLink to="/category/animados">Animados</NavLink></li>
                <li><NavLink to="/category/harry potter">Harry Potter</NavLink></li>
                <li><NavLink to="/category/argentina">Argentina</NavLink></li>
                <li><NavLink to="/category/futbol">Futbol</NavLink></li>
                <li><NavLink to="/category/coronados-gloria">Coronados de Gloria</NavLink></li>
                <li><NavLink to="/category/aesthetic">Aesthetic</NavLink></li>
                <li><NavLink to="/category/musica-nacional">Música Nacional</NavLink></li>
                <li><NavLink to="/category/musica-internacional">Música Internacional</NavLink></li>
                <li><NavLink to="/category/MARVEL-DC">MARVEL-DC</NavLink></li>
                <li><NavLink to="/category/los simpsons">Los Simpson</NavLink></li>
                <li><NavLink to="/category/disney">Disney</NavLink></li>
              </ul>
            </li>
            <li><NavLink to="/category/por-mayor">Por mayor</NavLink></li>
            <li><NavLink to="/category/planchitas">Planchitas</NavLink></li>
            <li><NavLink to="/category/personalizados">Personalizados</NavLink></li>
          </ul>
        </li>
      </ul>

      {/* Logo centrado */}
      <NavLink to="/" className="logo-link">
        <img src="/logo-boceto-02.webp" className="logo" alt="Logo de la tienda" />
      </NavLink>

      {/* Links derecha */}
      <ul className="nav-links right">
        <li>
          <NavLink to="/contacto" className="nav-link">Contacto</NavLink>
        </li>
        <li>
          {loading ? <Spinner type="dual-ring" size="small" /> : <CartWidget />}
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;