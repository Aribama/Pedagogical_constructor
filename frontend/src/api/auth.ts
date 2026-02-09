import { http } from "./http";
import type { Me } from "../types/auth";

export async function csrf(): Promise<void> {
  await http.get("/auth/csrf/");
}

export async function login(payload: { login: string; password: string }): Promise<void> {
  await http.post("/auth/login/", payload);
}

export async function logout(): Promise<void> {
  await http.post("/auth/logout/");
}

export async function register(payload: { username: string; email: string; password: string }): Promise<void> {
  await http.post("/auth/register/", payload);
}

export async function me(): Promise<Me> {
  const res = await http.get<Me>("/auth/me/");
  return res.data;
}
