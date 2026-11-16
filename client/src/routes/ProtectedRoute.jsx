import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../Features/Auth/Context/AuthContext';

export function ProtectedRoute({ allowedRoles }) {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Cargando sesión...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/IniciarSesion" state={{ from: location }} replace />;
  }

  // Extrae el rol sin importar si viene como string ("admin") o como objeto ({ name: "ADMIN" })
  const rawRole = typeof user?.role === 'object' ? user?.role?.name : user?.role;
  const normalized = rawRole ? String(rawRole).toUpperCase() : null;
  const roleAliases = {
    USER: 'CUSTOMER',
    CLIENT: 'CUSTOMER',
  };
  const userRole = normalized ? (roleAliases[normalized] || normalized) : null;

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/NoAutorizado" replace />;
  }

  return <Outlet />;
}

export function PublicOnlyRoute() {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  // Si ya inició sesión, lo manda directo al dashboard
  if (isAuthenticated) {return <Navigate to="/Inicio" replace />;}
  return <Outlet />;
}