import '../sass/NavBar.scss';
import CartWidget from "./CartWidget";
import Spinner from './Spinner';
import { NavLink } from "react-router-dom";
import { useCart } from '../context/CartContext';
import { useState, useEffect } from 'react';

const NavBar = () => {
const { cartQuantity } = useCart();
const [loading, setLoading] = useState(true);

useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 300); 
    return () => clearTimeout(timer);
}, [cartQuantity]);

return (
    <nav className='nav-container'>
        <NavLink to='/' className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}> 
            <img src='/logo-sin-fondo.png' className="logo" alt="Logo de la tienda" />
        </NavLink>
        <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Inicio</NavLink>
        <NavLink to="/category/nuevos" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Nuevos</NavLink>
        <NavLink to="/category/mas-vendidos" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Más Vendidos</NavLink>
        <NavLink to="/category/ofertas" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Ofertas</NavLink>

        {loading ? <Spinner type="dual-ring" size="small" /> : <CartWidget />}
        </nav>
    );
};

export default NavBar;