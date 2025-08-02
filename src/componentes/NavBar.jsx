import '../sass/NavBar.scss';
import CartWidget from "./CartWidget";
import { NavLink } from "react-router-dom";

const NavBar = () => {
return (
    <nav className='nav-container'>
            <NavLink to='/' className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}> 
                <img src='/logo-sin-fondo.png' className="logo" alt="Logo de la tienda" />
            </NavLink>
            <NavLink to="/category/nuevos"  className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>  Nuevos </NavLink>
            <NavLink to="/category/mas-vendidos" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}> Más Vendidos </NavLink>
            <NavLink to="/category/ofertas" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}> Ofertas </NavLink>
        <CartWidget />
    </nav>
    );
};

export default NavBar;
