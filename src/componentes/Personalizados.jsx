import "../sass/Personalizados.scss";

// ⚠️ Mismo número que en PriceStripList.jsx — si lo cambiás, actualizalo en los dos lugares
const WHATSAPP_NUMBER = "5491100000000";

export default function Personalizados() {
  const handleWhatsApp = () => {
    const mensaje = encodeURIComponent(
      "Hola! Quiero hacer un pedido personalizado de stickers. ¿Me contás cómo es el proceso?"
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${mensaje}`, "_blank");
  };

  return (
    <div className="personalizados-page">
      <h2>Stickers personalizados</h2>

      {/* ✏️ TODO: reemplazar este texto por la explicación real de tu proceso */}
      <p className="personalizados-page__intro">
        ¿Tenés una idea, un logo o una foto y querés convertirla en sticker?
        Hacemos diseños 100% personalizados a tu pedido.
      </p>

      <div className="personalizados-page__pasos">
        {/* ✏️ TODO: ajustar los pasos reales de tu proceso */}
        <div className="personalizados-page__paso">
          <span className="personalizados-page__numero">1</span>
          <div>
            <h4>Contanos tu idea</h4>
            <p>Mandanos por WhatsApp la imagen, foto o diseño que querés convertir en sticker.</p>
          </div>
        </div>

        <div className="personalizados-page__paso">
          <span className="personalizados-page__numero">2</span>
          <div>
            <h4>Te pasamos precio y boceto</h4>
            <p>Te mostramos cómo va a quedar antes de confirmar el pedido.</p>
          </div>
        </div>

        <div className="personalizados-page__paso">
          <span className="personalizados-page__numero">3</span>
          <div>
            <h4>Producción y entrega</h4>
            {/* ✏️ TODO: poner el tiempo de entrega real */}
            <p>Listo en 3 a 5 días hábiles una vez confirmado el pedido.</p>
          </div>
        </div>
      </div>

      <button className="personalizados-page__wsp-btn" onClick={handleWhatsApp}>
        💬 Hacer mi pedido personalizado
      </button>
    </div>
  );
}