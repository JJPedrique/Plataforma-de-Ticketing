import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../Features/Auth/Context/AuthContext';
import { normalizeRole } from '../shared/constants/roles';

export function ProtectedRoute({ allowedRoles }) {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Cargando sesión...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/IniciarSesion" state={{ from: location }} replace />;
  }

  const userRole = normalizeRole(user?.role);

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