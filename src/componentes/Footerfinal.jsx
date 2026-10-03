import React from "react";
import "../sass/Footer.scss";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__container">
        <p className="footer__copyright">
          © {new Date().getFullYear()} MeteleStickers. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
