import { useEffect, useState } from "react";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { useCart } from "../context/CartContextValue";
import { getOptimizedImageUrl } from "../utils/cloudinaryHelper";
import "../sass/PriceStripList.scss";

// ⚠️ Reemplazá por tu número real de WhatsApp (formato 549 + código de área + número, sin espacios ni +)
const WHATSAPP_NUMBER = "5491159122844";

// Convierte "$8.000" -> 8000
const parsePrecio = (str) => Number(String(str).replace(/[^\d]/g, "")) || 0;
 
/**
 * Lista de tiras de precio, conectada a Firestore.
 * @param {string} tipo - "por-mayor" | "planchitas", filtra qué packs mostrar
 *
 * "por-mayor" mantiene el botón de WhatsApp (consulta/coordinación).
 * "planchitas" usa selector de cantidad + "Agregar al carrito" (compra real).
 */
export default function PriceStripList({ tipo }) {
  const [packs, setPacks] = useState([]);
  const [seleccionado, setSeleccionado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cantidades, setCantidades] = useState({}); // { [packId]: cantidad }
 
  const { addItem } = useCart();
  const esCarrito = tipo === "planchitas";
 
  useEffect(() => {
    const fetchPacks = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, "packsPorMayor"),
          where("tipo", "==", tipo),
          orderBy("orden", "asc")
        );
        const snapshot = await getDocs(q);
        setPacks(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error cargando packs:", error);
        setPacks([]);
      } finally {
        setLoading(false);
      }
    };
 
    fetchPacks();
  }, [tipo]);
 
  const getCantidad = (packId) => cantidades[packId] ?? 1;
 
  const cambiarCantidad = (packId, delta) => {
    setCantidades((prev) => {
      const actual = prev[packId] ?? 1;
      const nueva = Math.max(1, actual + delta);
      return { ...prev, [packId]: nueva };
    });
  };
 
  const agregarAlCarrito = (pack, e) => {
    e.stopPropagation();
    const cantidad = getCantidad(pack.id);
    addItem(
      {
        id: pack.id,
        name: pack.name,
        price: parsePrecio(pack.precio),
        img: pack.img,
      },
      cantidad
    );
  };
 
  const abrirWhatsApp = (pack, e) => {
    e.stopPropagation();
    const mensaje = encodeURIComponent(
      `Hola! Me interesa el "${pack.name}" (${pack.precio}). ¿Me pasás más info?`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${mensaje}`, "_blank");
  };
 
  if (loading) {
    return <p className="price-strip-list__loading">Cargando packs...</p>;
  }
 
  if (packs.length === 0) {
    return null; // no mostramos nada si todavía no cargaste packs de este tipo en el admin
  }
 
  return (
    <div className="price-strip-list">
      {packs.map((pack) => (
        <div
          key={pack.id}
          className="price-strip"
          onClick={() => setSeleccionado(pack)}
        >
          <img src={getOptimizedImageUrl(pack.img, 220)} alt={pack.name} className="price-strip__img" />
 
          <div className="price-strip__info">
            <p className="price-strip__cantidad">{pack.cantidad}</p>
            <p className="price-strip__descripcion">{pack.descripcionCorta}</p>
          </div>
 
          <div className="price-strip__side">
            <span className="price-strip__precio">{pack.precio}</span>
 
            {esCarrito ? (
              <div className="price-strip__cart-controls" onClick={(e) => e.stopPropagation()}>
                <div className="price-strip__qty">
                  <button type="button" onClick={() => cambiarCantidad(pack.id, -1)}>−</button>
                  <span>{getCantidad(pack.id)}</span>
                  <button type="button" onClick={() => cambiarCantidad(pack.id, 1)}>+</button>
                </div>
                <button
                  className="price-strip__add-cart"
                  onClick={(e) => agregarAlCarrito(pack, e)}
                >
                  🛒 Agregar
                </button>
              </div>
            ) : (
              <button
                className="price-strip__wsp"
                onClick={(e) => abrirWhatsApp(pack, e)}
              >
                💬 WSP
              </button>
            )}
          </div>
        </div>
      ))}
 
      {seleccionado && (
        <div
          className="price-strip-modal__overlay"
          onClick={() => setSeleccionado(null)}
        >
          <div
            className="price-strip-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="price-strip-modal__close"
              onClick={() => setSeleccionado(null)}
            >
              ✕
            </button>
 
            <img
              src={getOptimizedImageUrl(seleccionado.img, 320)}
              alt={seleccionado.name}
              className="price-strip-modal__img"
            />
 
            <h3>{seleccionado.name}</h3>
            <p className="price-strip-modal__descripcion">
              {seleccionado.descripcionLarga}
            </p>
 
            <div className="price-strip-modal__precio-box">
              <p>{seleccionado.precioDetalle}</p>
            </div>
 
            {esCarrito ? (
              <>
                <div className="price-strip__qty price-strip__qty--modal">
                  <button type="button" onClick={() => cambiarCantidad(seleccionado.id, -1)}>−</button>
                  <span>{getCantidad(seleccionado.id)}</span>
                  <button type="button" onClick={() => cambiarCantidad(seleccionado.id, 1)}>+</button>
                </div>
                <button
                  className="price-strip-modal__wsp-btn"
                  onClick={(e) => agregarAlCarrito(seleccionado, e)}
                >
                  🛒 Agregar al carrito
                </button>
              </>
            ) : (
              <button
                className="price-strip-modal__wsp-btn"
                onClick={(e) => abrirWhatsApp(seleccionado, e)}
              >
                💬 Consultar por WhatsApp
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
 