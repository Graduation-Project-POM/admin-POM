import { createContext, useContext, useState, type ReactNode } from "react";
import type { UserRole } from "../types";

interface AuthState {
  token: string | null;
  role: UserRole | null;
  userName: string | null;
  trainerId: number | null;
}

interface AuthContextType extends AuthState {
  login: (data: {
    token: string;
    refreshToken: string;
    role: UserRole;
    userName: string;
    trainerId?: number | null;
  }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>(() => {
    const storedTrainerId = localStorage.getItem("trainerId");
    return {
      token: localStorage.getItem("accessToken"),
      role: (localStorage.getItem("role") as UserRole) || null,
      userName: localStorage.getItem("userName"),
      trainerId: storedTrainerId ? Number(storedTrainerId) : null,
    };
  });

  const login: AuthContextType["login"] = (data) => {
    const trainerId = data.trainerId ?? null;
    localStorage.setItem("accessToken", data.token);
    localStorage.setItem("refreshToken", data.refreshToken);
    localStorage.setItem("role", data.role);
    localStorage.setItem("userName", data.userName);
    if (trainerId != null) localStorage.setItem("trainerId", String(trainerId));
    else localStorage.removeItem("trainerId");
    setAuth({ token: data.token, role: data.role, userName: data.userName, trainerId });
  };

  const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("role");
  localStorage.removeItem("userName");
  localStorage.removeItem("trainerId");
  setAuth({ token: null, role: null, userName: null, trainerId: null });
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