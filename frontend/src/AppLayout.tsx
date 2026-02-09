import { Outlet } from "react-router-dom";
import Header from "./components/Header";

export default function AppLayout() {
  return (
    <>
      <Header username="user_test_3" />
      <main className="py-3">
        <Outlet />
      </main>
    </>
  );
}
