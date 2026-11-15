import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../Features/Auth/Context/AuthContext';

export function ProtectedRoute({ allowedRoles }) {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();
  // 1. Espera a que termine de verificar el token inicial
  if (loading) {return <div>Cargando sesión...</div>;}
  // 2. Si no hay sesión, redirige a /login guardando la ruta a la que intentaba entrar
  if (!isAuthenticated) {return <Navigate to="/IniciarSesion" state={{ from: location }} replace />;}
  // 3. (Opcional) Validación por roles
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/NoAutorizado" replace />;
  }
  // 4. Si todo está en orden, renderiza las rutas hijas
  return <Outlet />;
}

export function PublicOnlyRoute() {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  // Si ya inició sesión, lo manda directo al dashboard
  if (isAuthenticated) {return <Navigate to="/Inicio" replace />;}
  return <Outlet />;
}