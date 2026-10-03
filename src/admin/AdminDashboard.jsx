import { Outlet } from 'react-router-dom';
import { AdminNav } from './AdminNav';
import { useLocation } from 'react-router-dom';
import './sass/admin-theme.scss'; // 🔥 NUEVO — define las variables de color de todo el admin
import './sass/AdminDashboard.scss';

export const AdminDashboard = () => {
  const location = useLocation();

  return (
    <div className="admin-dashboard">
      <AdminNav currentPage={location.pathname} />
      <main className="admin-dashboard__content">
        <Outlet />
      </main>
    </div>
  );
};