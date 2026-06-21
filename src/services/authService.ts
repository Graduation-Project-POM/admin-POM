import axios from "axios";

// Configurable per environment. Set VITE_API_URL in .env / .env.production.
// Falls back to the local dev backend so existing local workflows keep working.
export const API_URL = import.meta.env.VITE_API_URL ?? "https://localhost:7205";

export const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const url: string = error?.config?.url ?? "";
    const isAuthCall = url.includes("/Auth/");
    if (status === 401 && !isAuthCall && localStorage.getItem("accessToken")) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("role");
      localStorage.removeItem("userName");
      if (!window.location.pathname.startsWith("/credentials")) {
        window.location.href = "/credentials/login";
      }
    }
    return Promise.reject(error);
  },
);

export const loginUser = async (userName: string, password: string) => {
  const response = await api.post("/Auth/auth", { userName, password });
  return response.data;
};

export interface SignupInput {
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  userName: string;
  phoneNumber?: string | null;
  gender: string;
  profileImageUrl?: string;
  password: string;
  roleID: number;
}

export const signupUser = async (data: SignupInput) => {
  const response = await api.post("/User/register", data);
  return response.data;
};