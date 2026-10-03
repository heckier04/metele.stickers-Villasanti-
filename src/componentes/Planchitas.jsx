import PlanchitasSlider from "./PlanchitasSlider";
import PriceStripList from "./PriceStripList";
import "../sass/Planchitas.scss";

export default function Planchitas() {
  return (
    <div className="planchitas-page">
      <PlanchitasSlider />

      <h2>Packs de planchitas por mayor</h2>
      <p className="planchitas-page__subtitle">
        Tocá cualquier pack para ver el detalle completo
      </p>
      <PriceStripList tipo="planchitas" />
    </div>
  );
}