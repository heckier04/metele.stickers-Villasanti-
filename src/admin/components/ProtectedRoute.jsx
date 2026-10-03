import { useEffect, useState } from 'react';
import { auth } from '../../../firebase/firebase';
import Login from './Login';

export const ProtectedRoute = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const user = auth.currentUser;

        if (!user) {
          // No hay usuario logueado — mostrar login
          setIsLoggedIn(false);
          setIsAdmin(null);
          setLoading(false);
          return;
        }

        setIsLoggedIn(true);

        // Forzar renovación del token para obtener custom claims actualizados
        const token = await user.getIdTokenResult(true);
        const isUserAdmin = token.claims.admin === true;

        if (isUserAdmin) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Error verificando admin:', error);
        setIsLoggedIn(false);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    // Escuchar cambios de autenticación
    const unsubscribe = auth.onAuthStateChanged(() => {
      checkAdminStatus();
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        fontSize: '1.2rem',
        color: '#666'
      }}>
        Verificando acceso...
      </div>
    );
  }

  // Si no está logueado, mostrar formulario de login
  if (!isLoggedIn) {
    return (
      <Login 
        onLoginSuccess={() => {
          setLoading(true);
          setTimeout(() => {
            setLoading(false);
          }, 1000);
        }}
      />
    );
  }

  // Si está logueado pero no es admin
  if (!isAdmin) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        fontSize: '1.2rem',
        color: '#ef4444'
      }}>
        Acceso denegado. Solo administradores pueden acceder.
      </div>
    );
  }

  return children;
};
