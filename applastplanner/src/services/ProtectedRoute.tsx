import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getToken } from './authService';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const validateToken = async () => {
      const token = getToken();
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {
        // Valida el token si necesitas verificarlo en el backend
        const response = await fetch('http://localhost:8000/auth/verify', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error al validar el token:', error);
        setIsAuthenticated(false);
      }
    };

    validateToken();
  }, []);

  if (isAuthenticated === null) {
    // Estado de carga mientras se verifica el token
    return <p>Cargando...</p>;
  }

  if (!isAuthenticated) {
    // Si no está autenticado, redirige al login
    return <Navigate to="/login" replace />;
  }

  // Si está autenticado, renderiza el contenido
  return <>{children}</>;
};

export default ProtectedRoute;
