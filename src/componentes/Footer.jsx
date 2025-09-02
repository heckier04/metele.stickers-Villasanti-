import "../sass/Footer.scss";
import React from "react";

const Footer = () => {
const logoFallback = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iIzY0ZmZkYSIvPgo8dGV4dCB4PSIyMCIgeT0iMjYiIGZpbGw9IiMxYTFhMmUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZm9udC13ZWlnaHQ9ImJvbGQiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkw8L3RleHQ+Cjwvc3ZnPg==";

return (
    <footer className="footer">
    <div className="footer__container">
        <div className="footer__content">
        {/* Brand */}
        <div className="footer__brand">
            <img src="/logo-sin-fondo.png"alt="Logo TiendaStore"className="footer__logo"onError={(e) => (e.currentTarget.src = logoFallback)}/>
        </div>

        </div>

        {/* Bottom */}
        <div className="footer__bottom">
        <p className="footer__copyright">
            © 2024 TiendaStore. Todos los derechos reservados.
        </p>
        </div>
    </div>
    </footer>
);
};

export default Footer;
