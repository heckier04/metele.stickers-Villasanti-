import "../sass/Footer.scss";
import React from "react";

const Footer = () => {

return (
    <footer className="footer">
    <div className="footer__container">
        <div className="footer__content">
            <div className="footer__brand">
                <img src="/logo-sin-fondo.png"alt="Logo TiendaStore"className="footer__logo"onError={(e) => (e.currentTarget.src = logoFallback)}/>
            </div>
        </div>
        <div className="footer__bottom">
        <p className="footer__copyright">
            © 2025 MeteleStickers. Todos los derechos reservados.
        </p>
        </div>
    </div>
    </footer>
);
};

export default Footer;
