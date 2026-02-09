import { Outlet } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
import Header from "../../components/Header";

export function AppLayout() {
  const { user, logout } = useAuth();

  return (
    <div>
      <Header
        username={user ? `${user.username} (${user.role})` : undefined}
        onLogout={logout}
      />

      <Outlet />
    </div>
  );
}
