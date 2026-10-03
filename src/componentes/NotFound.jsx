import React from 'react';
import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className="not-found">
            <img src="/descarga (13).jpeg" alt="Not Found" />
            <h2>Página no encontrada</h2>
            <Link to="/">Volver al inicio</Link>
        </div>
    );
};

export default NotFound;