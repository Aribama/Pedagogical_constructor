import { NavLink } from "react-router-dom";

type HeaderProps = {
  username?: string;
  onLogout?: () => void;
};

export function Header({ username, onLogout }: HeaderProps) {
  return (
    <header className="border-bottom bg-white">
      <div className="container" style={{ maxWidth: 1400 }}>
        <div className="d-flex align-items-center justify-content-between py-3">
          {/* Логотип + описание */}
          <div className="d-flex align-items-center gap-4">
            <div className="lh-sm">
              <div style={{ lineHeight: 0.95 }}>
                <div className="fs-5">
                  <span className="fw-bold text-primary">КО</span>нструктор
                </div>
                <div className="fs-5">
                  <span className="fw-bold text-primary">ЗА</span>нятий
                </div>
              </div>
              <div className="text-muted small">
                Сервис педагогического дизайна
              </div>
            </div>

            {/* Навигация */}
            <nav className="d-flex align-items-center gap-3 ms-3">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `text-decoration-none ${
                    isActive ? "fw-semibold text-primary" : "text-dark"
                  }`
                }
              >
                Главная
              </NavLink>

              <NavLink
                to="/catalog"
                className={({ isActive }) =>
                  `text-decoration-none ${
                    isActive ? "fw-semibold text-primary" : "text-dark"
                  }`
                }
              >
                Каталог
              </NavLink>

              <NavLink
                to="/wiki"
                className={({ isActive }) =>
                  `text-decoration-none ${
                    isActive ? "fw-semibold text-primary" : "text-dark"
                  }`
                }
              >
                Вики
              </NavLink>

              <NavLink
                to="/cabinet"
                className={({ isActive }) =>
                  `text-decoration-none ${
                    isActive ? "fw-semibold text-primary" : "text-dark"
                  }`
                }
              >
                Мой кабинет
              </NavLink>
            </nav>
          </div>

          {/* Пользователь */}
          <div className="d-flex align-items-center gap-3">
            {username ? (
              <span className="text-muted small">
                {username}
              </span>
            ) : null}

            <button
              className="btn btn-outline-secondary btn-sm"
              type="button"
              onClick={onLogout}
            >
              Выйти
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
