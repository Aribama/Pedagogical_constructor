import { Outlet } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
import Header from "../../components/Header";

export function AppLayout() {
  const { user, logout } = useAuth();
  return <div className="app-shell">
    <a className="skip-link" href="#main-content">Перейти к содержимому</a>
    <Header username={user?.username} onLogout={logout} />
    <main id="main-content"><Outlet /></main>
    <footer className="app-footer"><span>Конструктор занятий</span><span>Больше времени на главное — обучение.</span></footer>
  </div>;
}
