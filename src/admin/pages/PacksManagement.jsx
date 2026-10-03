import { useState, useMemo } from 'react';
import { useAdminPacks } from '../hooks/useAdminPacks';
import { PackForm } from '../components/PackForm';
import { getOptimizedImageUrl } from '../../utils/cloudinaryHelper';
import '../sass/PacksManagement.scss';

const IconPlus = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M12 5v14M5 12h14" />
  </svg>
);
const IconBox = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M21 8 12 3 3 8l9 5 9-5Z" /><path d="M3 8v8l9 5 9-5V8M12 13v8" />
  </svg>
);
const IconSearch = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
  </svg>
);
const IconEdit = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </svg>
);
const IconTrash = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 7h16M9 7V4h6v3m-8 0 1 13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1l1-13" />
  </svg>
);

export const PacksManagement = () => {
  const { packs, packsPorMayor, packsPlanchitas, loading, createPack, updatePack, deletePack } =
    useAdminPacks();
  const [showForm, setShowForm] = useState(false);
  const [editingPack, setEditingPack] = useState(null);
  const [filter, setFilter] = useState('todos');
  const [search, setSearch] = useState('');

  const filteredPacks = useMemo(() => {
    const base = filter === 'todos' ? packs : filter === 'por-mayor' ? packsPorMayor : packsPlanchitas;
    return base.filter((p) => !search.trim() || p.name?.toLowerCase().includes(search.trim().toLowerCase()));
  }, [packs, packsPorMayor, packsPlanchitas, filter, search]);

  const handleEdit = (pack) => {
    setEditingPack(pack);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingPack(null);
  };

  const handleSave = async (packData) => {
    try {
      if (editingPack) {
        await updatePack(editingPack.id, packData);
      } else {
        await createPack(packData);
      }
      handleCloseForm();
    } catch {
      alert('Ocurrió un error al guardar el pack.');
    }
  };

  const handleDelete = async (pack) => {
    if (window.confirm(`¿Borrar el pack "${pack.name}"?`)) {
      await deletePack(pack.id);
    }
  };

  if (loading) {
    return (
      <div className="packs-management">
        <p className="packs-management__empty">Cargando packs...</p>
      </div>
    );
  }

  return (
    <div className="packs-management">
      <div className="packs-management__header">
        <div className="packs-management__title">
          <IconBox />
          <div>
            <h2>Packs Por Mayor / Planchitas</h2>
            <p>Gestioná los packs que se muestran como tiras en la tienda</p>
          </div>
        </div>
        <button onClick={() => setShowForm(true)} className="packs-management__add-btn">
          <IconPlus /> Nuevo Pack
        </button>
      </div>

      <div className="packs-management__controls">
        <div className="packs-management__search">
          <IconSearch />
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="todos">Todos ({packs.length})</option>
          <option value="por-mayor">Por mayor ({packsPorMayor.length})</option>
          <option value="planchitas">Planchitas ({packsPlanchitas.length})</option>
        </select>
      </div>

      <div className="packs-management__list">
        {filteredPacks.length === 0 && <p className="packs-management__empty">No hay packs con ese filtro.</p>}

        {filteredPacks.map((pack) => (
          <div key={pack.id} className="packs-management__card">
            <img src={getOptimizedImageUrl(pack.img, 104)} alt={pack.name} className="packs-management__img" />

            <div className="packs-management__info">
              <span className={`packs-management__tipo-badge packs-management__tipo-badge--${pack.tipo}`}>
                {pack.tipo}
              </span>
              <h4>{pack.name}</h4>
              <p>{pack.cantidad} · {pack.precio}</p>
            </div>

            <div className="packs-management__actions">
              <button onClick={() => handleEdit(pack)} className="packs-management__btn-edit">
                <IconEdit /> Editar
              </button>
              <button onClick={() => handleDelete(pack)} className="packs-management__btn-delete">
                <IconTrash /> Borrar
              </button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <PackForm pack={editingPack} onSave={handleSave} onClose={handleCloseForm} />
      )}
    </div>
  );
};