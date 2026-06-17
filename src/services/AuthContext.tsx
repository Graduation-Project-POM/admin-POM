import { createContext, useContext, useState, type ReactNode } from "react";
import type { UserRole } from "../types";

interface AuthState {
  token: string | null;
  role: UserRole | null;
  userName: string | null;
}

interface AuthContextType extends AuthState {
  login: (data: {
    token: string;
    refreshToken: string;
    role: UserRole;
    userName: string;
  }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>(() => ({
    token: localStorage.getItem("accessToken"),
    role: (localStorage.getItem("role") as UserRole) || null,
    userName: localStorage.getItem("userName"),
  }));

  const login: AuthContextType["login"] = (data) => {
    localStorage.setItem("accessToken", data.token);
    localStorage.setItem("refreshToken", data.refreshToken);
    localStorage.setItem("role", data.role);
    localStorage.setItem("userName", data.userName);
    setAuth({ token: data.token, role: data.role, userName: data.userName });
  };

  const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("role");
  localStorage.removeItem("userName");
  setAuth({ token: null, role: null, userName: null });
};

  const value: AuthContextType = { ...auth, login, logout };
 return (
  <AuthContext.Provider value={value}>
    {children}
  </AuthContext.Provider>
);
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}