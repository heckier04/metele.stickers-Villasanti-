import { useContext } from 'react';
import { AdminContext } from '../context/AdminContextValue';

export const useAdminProducts = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error(
      'useAdminProducts debe usarse dentro de AdminProvider'
    );
  }
  return context;
};
