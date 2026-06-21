import axios from "axios";

export const API_URL = "http://localhost:5084";

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

export const signupUser = async (data: any) => {
  const response = await api.post("/User/register", data);
  return response.data;
};