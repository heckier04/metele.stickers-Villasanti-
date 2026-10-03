import { useEffect, useState } from "react";
import { collection, getDocs, query, limit } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { getOptimizedImageUrl } from "../utils/cloudinaryHelper";
import "../sass/Contacto.scss";
 
// ⚠️ Mismo número que usás en el resto del sitio (PriceStripList.jsx, Personalizados.jsx)
const WHATSAPP_NUMBER = "5491159122844";
const INSTAGRAM_USER = "metele.stickers"; // ✏️ cambiá esto por tu usuario real
const EMAIL = "calcomaniasbuenosaires@gmail.com"; // ✏️ cambiá esto por tu mail real

// Íconos simples en SVG, sin depender de ninguna librería externa
const IconWhatsApp = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
    <path d="M17.6 6.3A8 8 0 0 0 4.1 15.9L3 21l5.2-1.4A8 8 0 1 0 17.6 6.3ZM12 18.5a6.4 6.4 0 0 1-3.3-.9l-.2-.1-2.4.6.6-2.3-.2-.2A6.5 6.5 0 1 1 12 18.5Zm3.5-4.8c-.2-.1-1.2-.6-1.3-.6s-.3-.1-.4.1l-.6.7c-.1.1-.2.2-.4.1a5.3 5.3 0 0 1-1.6-1 5.9 5.9 0 0 1-1.1-1.3c-.1-.2 0-.3.1-.4l.3-.4c.1-.1.1-.2.2-.3v-.4l-.6-1.4c-.1-.4-.3-.3-.4-.3h-.4a.7.7 0 0 0-.5.2 2.2 2.2 0 0 0-.7 1.6c0 1 .7 1.9.8 2s1.4 2.2 3.4 3a11.6 11.6 0 0 0 1.1.4 2.7 2.7 0 0 0 1.2.1c.4-.1 1.2-.5 1.3-1a1.8 1.8 0 0 0 .1-1c-.1-.1-.2-.1-.4-.2Z" />
  </svg>
);
 
const IconInstagram = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
  </svg>
);
 
const IconMail = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
);
 
const IconClock = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);
 
const IconPin = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M12 21s-7-6.3-7-11a7 7 0 0 1 14 0c0 4.7-7 11-7 11Z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
);
 
export default function Contacto() {
  const [formData, setFormData] = useState({ nombre: "", email: "", mensaje: "" });
  const [stickers, setStickers] = useState([]);
 
  // Traemos algunos productos reales para usar como decoración
  useEffect(() => {
    const fetchStickers = async () => {
      try {
        const snap = await getDocs(query(collection(db, "productos"), limit(6)));
        setStickers(snap.docs.map((d) => d.data().img).filter(Boolean));
      } catch (error) {
        console.error("Error cargando stickers decorativos:", error);
      }
    };
    fetchStickers();
  }, []);
 
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
 
  const handleSubmit = (e) => {
    e.preventDefault();
    const partes = [
      `Hola! Soy ${formData.nombre}.`,
      formData.email ? `Mi email es ${formData.email}.` : null,
      formData.mensaje,
    ].filter(Boolean);
    const mensaje = encodeURIComponent(partes.join(" "));
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${mensaje}`, "_blank");
  };
 
  return (
    <div className="contacto-page">
      <div className="contacto-page__card">
        {/* Stickers decorativos, se salen del marco */}
        {stickers[0] && <img src={getOptimizedImageUrl(stickers[0], 200)} alt="" className="contacto-page__sticker s1" />}
        {stickers[1] && <img src={getOptimizedImageUrl(stickers[1], 200)} alt="" className="contacto-page__sticker s2" />}
        {stickers[2] && <img src={getOptimizedImageUrl(stickers[2], 200)} alt="" className="contacto-page__sticker s3" />}
        {stickers[3] && <img src={getOptimizedImageUrl(stickers[3], 200)} alt="" className="contacto-page__sticker s4" />}
 
        <h2>Contacto</h2>
        <p className="contacto-page__intro">
          ¿Tenés una consulta, un pedido especial o algo para decirnos?
          Completá el formulario y te respondemos por WhatsApp.
        </p>
 
        <div className="contacto-page__layout">
          <form className="contacto-page__form" onSubmit={handleSubmit}>
            <div className="contacto-page__group">
              <label htmlFor="nombre">Nombre</label>
              <input id="nombre" name="nombre" type="text" value={formData.nombre} onChange={handleChange} required />
            </div>
 
            <div className="contacto-page__group">
              <label htmlFor="email">Email (opcional)</label>
              <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} />
            </div>
 
            <div className="contacto-page__group">
              <label htmlFor="mensaje">Mensaje</label>
              <textarea id="mensaje" name="mensaje" rows={4} value={formData.mensaje} onChange={handleChange} required />
            </div>
 
            <button type="submit" className="contacto-page__submit">
              <IconWhatsApp /> Enviar por WhatsApp
            </button>
          </form>
 
          <div className="contacto-page__info">
            <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" className="contacto-page__info-item">
              <IconWhatsApp />
              <div>
                <h4>WhatsApp</h4>
                <p>Escribinos directo</p>
              </div>
            </a>
 
            <a href={`https://instagram.com/${INSTAGRAM_USER}`} target="_blank" rel="noreferrer" className="contacto-page__info-item">
              <IconInstagram />
              <div>
                <h4>Instagram</h4>
                <p>@{INSTAGRAM_USER}</p>
              </div>
            </a>
 
            <a href={`mailto:${EMAIL}`} className="contacto-page__info-item">
              <IconMail />
              <div>
                <h4>Email</h4>
                <p>{EMAIL}</p>
              </div>
            </a>
 
            <div className="contacto-page__info-item">
              <IconClock />
              <div>
                <h4>Horarios</h4>
                <p>Lunes a viernes de 10 a 18h</p>
              </div>
            </div>
 
            <div className="contacto-page__info-item">
              <IconPin />
              <div>
                <h4>Ubicación</h4>
                <p>Buenos Aires, Argentina</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
 