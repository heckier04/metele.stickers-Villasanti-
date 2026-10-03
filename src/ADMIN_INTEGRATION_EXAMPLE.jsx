/**
 * EJEMPLO DE INTEGRACIÓN DEL ADMIN PANEL EN TU APP
 * 
 * Este archivo muestra cómo integrar el Admin Panel en tu aplicación.
 * Copia estos imports y rutas a tu App.jsx actual.
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Importar el Admin Panel
import { 
  AdminProvider, 
  AdminDashboard, 
  AdminHome,
  ProductsManagement,
  StockControl,
  PromotionsManager,
  StoreOrganization,
  Profitability 
} from './admin';

// Importar tus componentes de tienda
import { CartProvider } from './context/CartContext';
import App from './App'; // Tu App actual

// ... otros imports

function AppWithAdmin() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>
          {/* Rutas de tu tienda normal */}
          <Route path="/*" element={<App />} />

          {/* NUEVO: Rutas del Admin Panel */}
          <Route
            path="/admin/*"
            element={
              <AdminProvider>
                <AdminDashboard />
              </AdminProvider>
            }
          >
            <Route index element={<AdminHome />} />
            <Route path="productos" element={<ProductsManagement />} />
            <Route path="stock" element={<StockControl />} />
            <Route path="promos" element={<PromotionsManager />} />
            <Route path="organizacion" element={<StoreOrganization />} />
            <Route path="rentabilidad" element={<Profitability />} />
          </Route>
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}

export default AppWithAdmin;

/**
 * PASOS PARA INTEGRAR:
 * 
 * 1. Actualiza tu main.jsx para usar AppWithAdmin en lugar de App:
 *    - import AppWithAdmin from './AppWithAdmin'
 *    - ReactDOM.createRoot(...).render(<AppWithAdmin />)
 * 
 * 2. Accede al admin en: http://localhost:5173/admin
 * 
 * 3. (IMPORTANTE) Protege la ruta con autenticación en producción
 *    - Solo usuarios admin deben poder acceder
 *    - Usa Firebase Rules o middleware de autenticación
 * 
 * 4. Verifica que Firebase esté configurado correctamente
 */
