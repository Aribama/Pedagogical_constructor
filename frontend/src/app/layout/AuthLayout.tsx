import { Outlet, Link } from "react-router-dom";

export function AuthLayout() {
  return (
    <div className="container" style={{ maxWidth: 420 }}>
      <div className="card" style={{ padding: 16 }}>
        <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
          <b>Lesson Constructor</b>
          <Link className="small" to="/catalog">Каталог</Link>
        </div>
        <hr />
        <Outlet />
      </div>
    </div>
  );
}
