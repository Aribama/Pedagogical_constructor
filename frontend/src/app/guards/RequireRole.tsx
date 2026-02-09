import { Navigate, Outlet } from "react-router-dom";
import type { Role } from "../../types/auth";
import { useAuth } from "../providers/AuthProvider";

export function RequireRole({ roles }: { roles: Role[] }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="container">Загрузка...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (!roles.includes(user.role)) return <Navigate to="/catalog" replace />;
  return <Outlet />;
}
