import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../app/providers/AuthProvider";

export function RegisterPage() {
  const { register } = useAuth();
  const nav = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      await register({ username, email, password });
      nav("/login");
    } catch (e: any) {
      const data = e?.response?.data;
      setErr(
        data?.username?.[0] ||
        data?.email?.[0] ||
        data?.detail ||
        "Не удалось зарегистрироваться"
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <h3 style={{ marginTop: 0 }}>Регистрация</h3>
      <form onSubmit={onSubmit} className="col">
        <div>
          <div className="small">Логин</div>
          <input className="input" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          <div className="small">Email</div>
          <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <div className="small">Пароль</div>
          <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

        {err && <div className="small" style={{ color: "#c62828" }}>{err}</div>}

        <button className="btn primary" disabled={busy}>
          {busy ? "Создаём..." : "Создать аккаунт"}
        </button>

        <div className="small">
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </div>
      </form>
    </div>
  );
}
