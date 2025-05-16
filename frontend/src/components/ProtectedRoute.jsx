import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute({ allowedRoles = [] }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.rol_nombre)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}