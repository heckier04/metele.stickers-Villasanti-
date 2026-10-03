export const PromoCard = ({ promo, onEdit, onDelete, onToggleActive }) => {
  const handleToggleActive = () => {
    onToggleActive(promo.id, { active: !promo.active });
  };

  const discountDisplay =
    promo.type === 'porcentaje' ? `${promo.value}%` : `$${promo.value}`;

  return (
    <div className={`promo-card ${promo.active ? 'active' : 'inactive'}`}>
      <div className="promo-card__header">
        <h3>{promo.name}</h3>
        <span className="promo-card__badge">{discountDisplay}</span>
      </div>

      {promo.description && (
        <p className="promo-card__description">{promo.description}</p>
      )}

      <div className="promo-card__details">
        {promo.startDate && (
          <div>
            <span className="promo-card__label">Válido desde:</span>
            <span>{new Date(promo.startDate).toLocaleDateString('es-ES')}</span>
          </div>
        )}
        {promo.endDate && (
          <div>
            <span className="promo-card__label">Hasta:</span>
            <span>{new Date(promo.endDate).toLocaleDateString('es-ES')}</span>
          </div>
        )}
        <div>
          <span className="promo-card__label">Aplicable a:</span>
          <span>{promo.applicableTo}</span>
        </div>
        <div>
          <span className="promo-card__label">Productos:</span>
          <span>{promo.selectedIds?.length || 'Todos'}</span>
        </div>
      </div>

      <div className="promo-card__status">
        {promo.active ? '🟢 Activa' : '🔴 Inactiva'}
      </div>

      <div className="promo-card__actions">
        <button
          className="promo-card__btn promo-card__btn--toggle"
          onClick={handleToggleActive}
        >
          {promo.active ? '⊘ Desactivar' : '✓ Activar'}
        </button>
        <button
          className="promo-card__btn promo-card__btn--edit"
          onClick={() => onEdit(promo)}
        >
          Editar
        </button>
        <button
          className="promo-card__btn promo-card__btn--delete"
          onClick={() => {
            if (
              window.confirm(
                `¿Eliminar la promoción "${promo.name}"?`
              )
            ) {
              onDelete(promo.id);
            }
          }}
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};
