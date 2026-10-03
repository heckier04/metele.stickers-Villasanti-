import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import NavBar from "./componentes/NavBar";
import ItemListContainer from "./componentes/ItemListContainer";
import ItemDetailContainer from "./componentes/ItemDetailContainer";
import NotFound from "./componentes/NotFound";
import ProductCategories from "./componentes/ProductCategories";
import Categories from "./componentes/Categories";
import SpecialProducts from "./componentes/SpecialProducts";
import { CartProvider } from "./context/CartContext";
import Cart from "./componentes/cart";
import Checkout from "./componentes/Checkout";
import Footer from "./componentes/Footerfinal";
import CartDrawer from "./componentes/CartDrawer"; // 🔥 NUEVO
import './styles.css';

import {
  AdminProvider,
  AdminDashboard,
  AdminHome,
  ProductsManagement,
  StockControl,
  PromotionsManager,
  StoreOrganization,
  Profitability,
  SliderManager,
  Orders, // 🔥 NUEVO
  PacksManagement // 🔥 NUEVO
} from './admin';

import { ProtectedRoute } from './admin/components/ProtectedRoute';
import Banner from './componentes/Banner';
import StickerSlider from './componentes/StickerSlider';

import TornasoladosSlider from "./componentes/TornasoladosSlider";
import MasVendidosSlider from "./componentes/MasVendidosSlider";
import UnicosSlider from "./componentes/UnicosSlider";
import PlanchitasSlider from "./componentes/PlanchitasSlider";
import Contacto from "./componentes/contacto";

// Necesita estar DENTRO de <BrowserRouter> para poder usar useLocation
function AppContent() {
  const location = useLocation();
  const esAdmin = location.pathname.startsWith('/admin');

  return (
    <div className="app-container">

      {/* El NavBar, el carrito lateral y el Footer de la tienda pública
          no tienen que verse dentro del panel admin */}
      {!esAdmin && <NavBar />}
      {!esAdmin && <CartDrawer />}

      <main className="main">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Banner
                  images={[
                  '/bannerrr-mele-01.webp',
                  '/bannerrr-mele-02.webp',
                  '/bannerrr-mele-03.webp',
                  '/bannerrr-mele-04.webp'
                  ]}
                />
                <StickerSlider />
                <ItemListContainer saludo="¡Bienvenido a la tienda de stickers!" />

                <Banner
                  images={['/bannerrr-mele-05.webp', '/bannerrr-mele-06.webp']}
                />

                <TornasoladosSlider />
                <MasVendidosSlider />
                <UnicosSlider />
                <PlanchitasSlider />
              </>
            }
          />

          <Route
            path="/category/:category"
            element={<ItemListContainer />}
          />

          <Route path="/item/:id" element={<ItemDetailContainer />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/categorias" element={<Categories />} />
          <Route path="/especiales" element={<SpecialProducts />} />
          <Route path="/productos" element={<ProductCategories />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="*" element={<NotFound />} />

          {/* ADMIN */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <AdminProvider>
                  <AdminDashboard />
                </AdminProvider>
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminHome />} />
            <Route path="gestion-productos" element={<ProductsManagement />} />
            <Route path="stock" element={<StockControl />} />
            <Route path="promos" element={<PromotionsManager />} />
            <Route path="slider" element={<SliderManager />} />
            <Route path="organizacion" element={<StoreOrganization />} />
            <Route path="rentabilidad" element={<Profitability />} />
            <Route path="pedidos" element={<Orders />} /> {/* 🔥 NUEVO */}
            <Route path="packs" element={<PacksManagement />} /> {/* 🔥 NUEVO */}
          </Route>

        </Routes>
      </main>

      {!esAdmin && <Footer />}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;