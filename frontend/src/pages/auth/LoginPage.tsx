import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../app/providers/AuthProvider";

export function LoginPage() {
  const { login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation() as any;

  const [loginValue, setLoginValue] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      await login({ login: loginValue, password });
      nav(loc.state?.from || "/catalog");
    } catch (e: any) {
      setErr(e?.response?.data?.detail || "Не удалось войти");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <h3 style={{ marginTop: 0 }}>Вход</h3>
      <form onSubmit={onSubmit} className="auth-form">
        <div>
          <label className="small" htmlFor="login">Логин или email</label>
          <input className="input" required id="login" autoComplete="username" value={loginValue} onChange={(e) => setLoginValue(e.target.value)} />
        </div>
        <div>
          <label className="small" htmlFor="password">Пароль</label>
          <input className="input" required id="password" autoComplete="current-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

        {err && <div role="alert" className="small" style={{ color: "#c62828" }}>{err}</div>}

        <button className="btn primary" disabled={busy}>
          {busy ? "Входим..." : "Войти"}
        </button>

        <div className="small">
          Нет аккаунта? <Link to="/register">Регистрация</Link>
        </div>
      </form>
    </div>
  );
}
