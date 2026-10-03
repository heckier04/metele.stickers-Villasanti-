import '../sass/ItemListConteiner.scss';
import { useEffect, useState, useMemo } from 'react';
import ItemList from './ItemList';
import Mayorista from './Mayorista';
import Planchitas from './Planchitas';
import Personalizados from './Personalizados';
import { useParams } from 'react-router-dom';
import { collection, getDocs, query, where, limit, startAfter } from 'firebase/firestore';
import { db } from "../../firebase/firebase";
import '../sass/shared.scss';

// Categorías que NO usan la grilla común de productos, sino una vista especial
const CATEGORIAS_ESPECIALES = ['por-mayor', 'planchitas', 'personalizados'];

const ItemListContainer = () => {
  const [data, setData] = useState([]);
  const [lastDoc, setLastDoc] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortMode, setSortMode] = useState('todos'); // todos | alfabetico | mas-vendido | oferta
  const [offerProductIds, setOfferProductIds] = useState(new Set());
  const { category } = useParams();

  const esCategoriaEspecial = CATEGORIAS_ESPECIALES.includes(category);

  useEffect(() => {
    // Si es una categoría especial, no hace falta traer productos de la grilla común
    if (esCategoriaEspecial) return;

    const fetchProducts = async (loadMore = false) => {
      try {
        let productsQuery;

        if (category) {
          // En una categoría puntual traemos TODOS los productos de una,
          // sin paginar ni mostrar "Cargar más"
          productsQuery = query(
            collection(db, "productos"),
            where("category", "==", category)
          );
        } else {
          // Solo la home pagina de a 14
          const LIMIT = 14;
          productsQuery = query(
            collection(db, "productos"),
            limit(LIMIT),
            ...(loadMore && lastDoc ? [startAfter(lastDoc)] : [])
          );
        }

        const snapshot = await getDocs(productsQuery);
        const list = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        if (loadMore) {
          setData(prev => [...prev, ...list]);
        } else {
          setData(list);
        }

        if (snapshot.docs.length > 0) {
          setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
        }

        // En categoría no hay "cargar más" nunca; en home depende de si llegó al límite
        setHasMore(category ? false : snapshot.docs.length === 14);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProducts();
  }, [category, esCategoriaEspecial]);

  // Traemos las promos activas una sola vez, para saber qué productos están "en oferta"
  useEffect(() => {
    if (esCategoriaEspecial) return;

    const fetchOfertas = async () => {
      try {
        const promosSnap = await getDocs(
          query(collection(db, "promos"), where("active", "==", true))
        );
        const ids = new Set();
        promosSnap.docs.forEach((doc) => {
          const promo = doc.data();
          if (Array.isArray(promo.selectedIds)) {
            promo.selectedIds.forEach((id) => ids.add(id));
          }
        });
        setOfferProductIds(ids);
      } catch (error) {
        console.error("Error cargando ofertas:", error);
      }
    };

    fetchOfertas();
  }, [esCategoriaEspecial]);

  const handleLoadMore = async () => {
    setLoadingMore(true);
    const fetchProductsMore = async () => {
      try {
        const LIMIT = 14;
        const productsQuery = query(
          collection(db, "productos"),
          limit(LIMIT),
          ...(lastDoc ? [startAfter(lastDoc)] : [])
        );

        const snapshot = await getDocs(productsQuery);
        const list = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setData(prev => [...prev, ...list]);

        if (snapshot.docs.length > 0) {
          setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
        }

        setHasMore(snapshot.docs.length === LIMIT);
      } catch (error) {
        console.error(error);
      }
    };
    await fetchProductsMore();
    setLoadingMore(false);
  };

  // Búsqueda por nombre + orden/filtro, aplicado sobre lo ya cargado en pantalla
  // (nota: si usás "Cargar más", el buscador solo mira lo que ya se cargó,
  // no busca en toda la categoría de una)
  const displayData = useMemo(() => {
    let result = data;

    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase();
      result = result.filter((p) => p.name?.toLowerCase().includes(term));
    }

    if (sortMode === 'alfabetico') {
      result = [...result].sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    } else if (sortMode === 'mas-vendido') {
      result = [...result].sort((a, b) => (b.soldUnits || 0) - (a.soldUnits || 0));
    } else if (sortMode === 'oferta') {
      result = result.filter((p) => offerProductIds.has(p.id));
    }

    return result;
  }, [data, searchTerm, sortMode, offerProductIds]);

  // ===== Vistas especiales, reemplazan la grilla común =====
  if (category === 'por-mayor') return <Mayorista />;
  if (category === 'planchitas') return <Planchitas />;
  if (category === 'personalizados') return <Personalizados />;

  // ===== Grilla común (comportamiento de siempre) =====
  return (
    <div className="item-list-layout">
      {/* El buscador/orden solo tiene sentido dentro de una categoría, no en la home */}
      {category && (
        <aside className="item-list-sidebar">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre..."
            className="item-list-sidebar__search"
          />
          <select
            value={sortMode}
            onChange={(e) => setSortMode(e.target.value)}
            className="item-list-sidebar__sort"
          >
            <option value="todos">Orden: relevancia</option>
            <option value="alfabetico">Orden alfabético (A-Z)</option>
            <option value="mas-vendido">Más vendidos primero</option>
            <option value="oferta">Solo en oferta</option>
          </select>
        </aside>
      )}

      <div className="item-list-content">
        {displayData.length > 0 ? <ItemList data={displayData} /> : <p>No hay productos disponibles</p>}

        {/* "Cargar más" solo existe en la home, en categoría se trae todo de una */}
        {!category && hasMore && lastDoc && (
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="btn-cargar"
          >
            {loadingMore ? "Cargando..." : "Cargar más"}
          </button>
        )}
      </div>
    </div>
  );
};

export default ItemListContainer;