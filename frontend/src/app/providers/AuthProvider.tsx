import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Me } from "../../types/auth";
import * as AuthAPI from "../../api/auth";

type AuthCtx = {
  user: Me | null;
  loading: boolean;
  refresh: () => Promise<void>;
  login: (payload: { login: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  register: (payload: { username: string; email: string; password: string }) => Promise<void>;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const me = await AuthAPI.me();
      setUser(me);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        await AuthAPI.csrf();
        await refresh();
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (payload: { login: string; password: string }) => {
    await AuthAPI.csrf();
    await AuthAPI.login(payload);
    await refresh();
  };

  const logout = async () => {
    await AuthAPI.csrf();
    await AuthAPI.logout();
    setUser(null);
  };

  const register = async (payload: { username: string; email: string; password: string }) => {
    await AuthAPI.csrf();
    await AuthAPI.register(payload);
  };

  const value = useMemo(() => ({ user, loading, refresh, login, logout, register }), [user, loading]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used within AuthProvider");
  return v;
}
