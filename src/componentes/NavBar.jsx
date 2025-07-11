import '../sass/NavBar.scss';
import CartWidget from "./CartWidget";

const NavBar = () => {
    return (
        <nav className='nav-container'>
            <img src='../logo-sin-fondo.png' className="logo" alt="Logo de la tienda" />
            <a className="nav-link" href="#">Nuevos</a>
            <a className="nav-link" href="#">Más Vendidos</a>
            <a className="nav-link" href="#">Ofertas</a>
            <CartWidget count={5} />
        </nav>
    );
};

export default NavBar;