import { useState } from "react";
import { useCart } from "../context/CartContextValue";
import "../sass/CheckoutForm.scss";

// Puntos de retiro fijos. Cuando quieras hacerlos editables desde el
// admin, esto se reemplaza por una lectura a Firestore (colección "puntosRetiro").
const PUNTOS_RETIRO = [
  { id: "Barracas", nombre: "Barracas · av.Montes de Oca 1710 ", horario: "Mar y jue 17-19h" },
  { id: "Barracas", nombre: "Barracas · Plaza Colombia", horario: "Sáb 11-13h" },
];

// Costo de envío fijo por ahora. Cuando conectes Correo Argentino / Envíopack,
// esto se reemplaza por una consulta real según el código postal.
const COSTO_ENVIO_FIJO = 1500;

// entrega y setEntrega vienen de Checkout.jsx, así el resumen se actualiza en vivo
const CheckoutForm = ({ onSubmit, entrega, setEntrega }) => {
  const { cartTotal } = useCart();

  const [puntoElegido, setPuntoElegido] = useState(PUNTOS_RETIRO[0].id);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    paymentMethod: "transfer",
  });

  const [isProcessing, setIsProcessing] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const seleccionarDomicilio = () => {
    setEntrega({ tipo: "domicilio", costo: COSTO_ENVIO_FIJO, punto: null });
  };

  const seleccionarPunto = (puntoId = puntoElegido) => {
    const punto = PUNTOS_RETIRO.find((p) => p.id === puntoId);
    setEntrega({ tipo: "punto", costo: 0, punto });
  };

  const handleElegirPunto = (id) => {
    setPuntoElegido(id);
    seleccionarPunto(id);
  };

  const totalConEnvio = cartTotal() + entrega.costo;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    const dataCompleta = {
      ...formData,
      // Si es retiro en punto, no hace falta la dirección del comprador
      address: entrega.tipo === "domicilio" ? formData.address : "",
      city: entrega.tipo === "domicilio" ? formData.city : "",
      zipCode: entrega.tipo === "domicilio" ? formData.zipCode : "",
      entrega,
    };

    setTimeout(() => {
      onSubmit(dataCompleta);
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <div className="checkout-form">
      <form onSubmit={handleSubmit} className="form-container">

        {/* PASO DE ENTREGA */}
        <div className="form-group">
          <label className="form-section-label">¿Cómo lo recibís?</label>
          <div className="delivery-toggle">
            <button
              type="button"
              className={`delivery-toggle__btn ${entrega.tipo === "domicilio" ? "active" : ""}`}
              onClick={seleccionarDomicilio}
            >
              📦 Envío a domicilio
            </button>
            <button
              type="button"
              className={`delivery-toggle__btn ${entrega.tipo === "punto" ? "active" : ""}`}
              onClick={() => seleccionarPunto()}
            >
              📍 Punto de retiro
            </button>
          </div>
        </div>

        {entrega.tipo === "domicilio" ? (
          <>
            <div className="form-group">
              <input
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Dirección"
                required
              />
            </div>
            <div className="form-group">
              <div className="form-grid">
                <input
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Ciudad"
                  required
                />
                <input
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  placeholder="Código Postal"
                  required
                />
              </div>
            </div>
            <p className="delivery-note">
              Envío por Correo Argentino: ${COSTO_ENVIO_FIJO} · llega en 3-5 días hábiles
            </p>
          </>
        ) : (
          <div className="form-group">
            <div className="pickup-points">
              {PUNTOS_RETIRO.map((p) => (
                <button
                  type="button"
                  key={p.id}
                  className={`pickup-points__item ${puntoElegido === p.id ? "active" : ""}`}
                  onClick={() => handleElegirPunto(p.id)}
                >
                  <strong>{p.nombre}</strong>
                  <span>{p.horario}</span>
                </button>
              ))}
            </div>
            <p className="delivery-note">Retiro gratis, sin costo de envío.</p>
          </div>
        )}

        {/* DATOS DEL COMPRADOR */}
        <div className="form-group">
          <div className="form-grid">
            <input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Nombre" required />
            <input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Apellido" required />
          </div>
        </div>

        <div className="form-group">
          <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
        </div>

        <div className="form-group">
          <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Teléfono" required />
        </div>

        <div className="form-group">
          <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange}>
            <option value="mp">Mercado Pago</option>
            <option value="transfer">Transferencia</option>
          </select>
        </div>

        <button type="submit" className="submit-button" disabled={isProcessing}>
          {isProcessing && <div className="loading-spinner"></div>}
          {isProcessing ? "Procesando..." : `Pagar $${totalConEnvio.toFixed(2)}`}
        </button>

      </form>
    </div>
  );
};

export default CheckoutForm;