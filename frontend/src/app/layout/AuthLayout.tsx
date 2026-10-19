import { Outlet, Link } from "react-router-dom";
import { GoatMark } from "../../components/GoatMark";

export function AuthLayout() {
  return (
    <main className="auth-page">
      <div className="auth-intro">
        <span className="brand-symbol">
          <GoatMark />
        </span>
        <span className="eyebrow">КоЗА · Конструктор занятий</span>
        <h1>
          Хорошее занятие
          <br />
          начинается с идеи.
        </h1>
        <p>
          Пространство, где педагогические приёмы
          <br />
          становятся вашими сценариями.
        </p>
        <span className="auth-footnote">Создано для тех, кто учит.</span>
      </div>
      <div className="auth-form-side">
        <div className="auth-card">
          <Outlet />
        </div>
        <p className="auth-help">Педагогический дизайн. В вашем ритме.</p>
        <Link className="auth-switch" to="/login">
          КоЗА · Конструктор занятий
        </Link>
      </div>
    </main>
  );
}
