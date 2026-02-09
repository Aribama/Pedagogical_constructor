export type Role = "user" | "moderator" | "admin";

export type Me = {
  id: number;
  username: string;
  email: string | null;
  role: Role;
};
