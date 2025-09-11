import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./componentes/NavBar";
import ItemListContainer from "./componentes/ItemListContainer";
import ItemDetailContainer from "./componentes/ItemDetailContainer";
import NotFound from "./componentes/NotFound";
import { CartProvider } from "./context/CartContext";
import Cart from "./componentes/cart";
import Checkout from "./componentes/Checkout";
import Footer from "./componentes/Footerfinal";
import './styles.css';

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <div className="app-container">
          <NavBar />
          <main className="main">
            <Routes>
              <Route
                path="/"
                element={<ItemListContainer saludo="¡Bienvenido a la tienda de stickers!" />}
              />
              <Route
                path="/category/:category"
                element={<ItemListContainer saludo="¡Bienvenido a la tienda de stickers!" />}
              />
              <Route path="/item/:id" element={<ItemDetailContainer />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
