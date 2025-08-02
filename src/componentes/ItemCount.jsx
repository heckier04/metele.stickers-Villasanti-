import { useState } from "react";

const ItemCount = ({ stock, onAdd }) => {
    const [count, setCount] = useState(1);
    const [error, setError] = useState(null);

const sumar = () => {
    if (count < stock) {
        setCount(count + 1);
        setError(null);
    }
};

const restar = () => {
    if (count > 1) {
        setCount(count - 1);
        setError(null);
    }
};

const comprar = () => {
    if (count <= stock) {
        onAdd(count);
        setError(null);
    } else {
        setError("No hay suficiente stock");
    }
};

return (
        <div className="item-count">
            <div>
                <button className="btn btn-secondary menos" onClick={restar}>-</button>
                <span className="count">{count}</span>
                <button className="btn btn-secondary mas" onClick={sumar}>+</button>
            </div>
            <button className="btn btn-cash" disabled={stock === 0} onClick={comprar}>comprar</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default ItemCount;
