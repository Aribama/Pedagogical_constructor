import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { ArrowUpRight, Layers2, LogOut, Menu, X } from "lucide-react";

type HeaderProps = { username?: string; onLogout?: () => void };

export function Header({ username, onLogout }: HeaderProps) {
  const [open, setOpen] = useState(false);
  return (
    <header className="app-header">
      <div className="header-inner">
        <Link
          to="/"
          className="brand"
          aria-label="Конструктор занятий — главная"
        >
          <span className="brand-symbol">
            <Layers2 size={21} strokeWidth={1.7} />
          </span>
          <span>
            Конструктор
            <span className="brand-caption">Педагогический дизайн</span>
          </span>
        </Link>
        <button
          className="icon-button mobile-menu"
          aria-label={open ? "Закрыть меню" : "Открыть меню"}
          aria-expanded={open}
          aria-controls="main-navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={21} /> : <Menu size={21} />}
        </button>
        <nav
          id="main-navigation"
          className={`main-nav ${open ? "is-open" : ""}`}
          aria-label="Основная навигация"
        >
          {[
            ["/", "Обзор"],
            ["/catalog", "Каталог приёмов"],
            ["/wiki", "База знаний"],
            ["/cabinet", "Мои занятия"],
          ].map(([to, title]) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `nav-item ${isActive ? "is-active" : ""}`
              }
            >
              {title}
            </NavLink>
          ))}
        </nav>
        <div className="header-account">
          {username && (
            <span
              className="account-avatar"
              title={username}
              aria-label={`Пользователь ${username}`}
            >
              {username.slice(0, 1).toUpperCase()}
            </span>
          )}
          <button
            className="icon-button"
            type="button"
            onClick={onLogout}
            aria-label="Выйти из аккаунта"
            title="Выйти"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
      <div className="workspace-strip">
        <span>Рабочее пространство преподавателя</span>
        <Link to="/scenario">
          Открыть конструктор <ArrowUpRight size={13} />
        </Link>
      </div>
    </header>
  );
}
export default Header;
