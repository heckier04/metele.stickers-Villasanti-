import { useState } from 'react';
import { useAdminOrders } from '../hooks/useAdminOrders';
import '../sass/Orders.scss';

export const Orders = () => {
  const { pendingOrders, paidOrders, cancelledOrders, loading, actionError, confirmOrder, rejectOrder } =
    useAdminOrders();
  const [showHistory, setShowHistory] = useState(false);
  const [confirmingId, setConfirmingId] = useState(null);

  const handleConfirm = async (orderId) => {
    setConfirmingId(orderId);
    await confirmOrder(orderId);
    setConfirmingId(null);
  };

  const handleReject = async (orderId) => {
    if (!window.confirm('¿Cancelar este pedido? No se descontará stock.')) return;
    await rejectOrder(orderId);
  };

  if (loading) {
    return (
      <div className="orders">
        <p>Cargando pedidos...</p>
      </div>
    );
  }

  return (
    <div className="orders">
      <div className="orders__header">
        <h2>Pedidos</h2>
        <p>Confirmá transferencias y gestioná el estado de las órdenes</p>
      </div>

      {actionError && (
        <div className="orders__alert orders__alert--critical">
          <p>{actionError}</p>
        </div>
      )}

      {/* Alertas */}
      <div className="orders__alerts">
        {pendingOrders.length > 0 ? (
          <div className="orders__alert orders__alert--warning">
            <p>Tenés {pendingOrders.length} pedido(s) pendiente(s) de confirmación</p>
          </div>
        ) : (
          <div className="orders__alert orders__alert--success">
            <p>No hay pedidos pendientes</p>
          </div>
        )}
      </div>

      {/* Pedidos pendientes */}
      <div className="orders__section">
        <h3>Pendientes de confirmación</h3>
        <div className="orders__list">
          {pendingOrders.map((order) => (
            <div key={order.id} className="orders__card orders__card--pending">
              <div className="orders__card-header">
                <div>
                  <span className="orders__id">#{order.id.slice(0, 8)}</span>
                  <span className="orders__method-badge">
                    {order.paymentMethod === 'transfer' ? 'Transferencia' : order.paymentMethod}
                  </span>
                </div>
                <span className="orders__total">${order.total?.toFixed(2)}</span>
              </div>

              <div className="orders__buyer">
                <p><strong>{order.buyer?.firstName} {order.buyer?.lastName}</strong></p>
                <p>{order.buyer?.email} · {order.buyer?.phone}</p>
                {order.buyer?.address && (
                  <p>{order.buyer.address}, {order.buyer.city} ({order.buyer.zipCode})</p>
                )}
              </div>

              <div className="orders__items">
                {order.items?.map((item) => (
                  <div key={item.id} className="orders__item-row">
                    <span>{item.name} x{item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="orders__actions">
                <button
                  className="orders__btn orders__btn--confirm"
                  onClick={() => handleConfirm(order.id)}
                  disabled={confirmingId === order.id}
                >
                  {confirmingId === order.id ? 'Confirmando...' : 'Confirmar pago'}
                </button>
                <button
                  className="orders__btn orders__btn--reject"
                  onClick={() => handleReject(order.id)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          ))}

          {pendingOrders.length === 0 && (
            <p className="orders__empty">No hay pedidos esperando confirmación.</p>
          )}
        </div>
      </div>

      {/* Historial */}
      <div className="orders__history">
        <button className="orders__btn-history" onClick={() => setShowHistory(!showHistory)}>
          {showHistory ? 'Ocultar' : 'Ver'} Historial ({paidOrders.length + cancelledOrders.length})
        </button>

        {showHistory && (
          <div className="orders__history-list">
            {[...paidOrders, ...cancelledOrders]
              .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
              .map((order) => (
                <div key={order.id} className="orders__history-item">
                  <span className="orders__id">#{order.id.slice(0, 8)}</span>
                  <span>{order.buyer?.firstName} {order.buyer?.lastName}</span>
                  <span>${order.total?.toFixed(2)}</span>
                  <span className={`orders__status-badge orders__status-badge--${order.status}`}>
                    {order.status === 'paid' ? 'Pagado' : 'Cancelado'}
                  </span>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};