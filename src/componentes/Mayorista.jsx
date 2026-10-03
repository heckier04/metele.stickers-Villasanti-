import PriceStripList from "./PriceStripList";
import "../sass/Mayorista.scss";

export default function Mayorista() {
  return (
    <div className="mayorista-page">
      <h2>Venta por mayor</h2>
      <p className="mayorista-page__subtitle">
        Tocá cualquier pack para ver el detalle completo
      </p>
      <PriceStripList tipo="por-mayor" />
    </div>
  );
}