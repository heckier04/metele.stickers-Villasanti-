import { getOptimizedImageUrl } from '../../utils/cloudinaryHelper';

export const StockAlert = ({ level, title, count, items, message }) => {
  return (
    <div className={`stock-alert stock-alert--${level}`}>
      <div className="stock-alert__header">
        <h3>{title}</h3>
        <span className="stock-alert__badge">{count}</span>
      </div>
      {message && <p className="stock-alert__message">{message}</p>}
      <ul className="stock-alert__items">
        {items.slice(0, 5).map((item) => (
          <li key={item.id}>
            <img src={getOptimizedImageUrl(item.img, 60)} alt={item.name} />
            <span>{item.name}</span>
            <strong>{item.stock} unidades</strong>
          </li>
        ))}
      </ul>
      {count > 5 && (
        <p className="stock-alert__more">+{count - 5} más...</p>
      )}
    </div>
  );
};