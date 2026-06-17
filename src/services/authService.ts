import axios from "axios";

const API_URL = "https://localhost:7205";

// one shared instance for the whole app
export const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const loginUser = async (userName: string, password: string) => {
  const response = await api.post("/Auth/auth", { userName, password });
  return response.data;
};

export const signupUser = async (data: any) => {
  const response = await api.post("/User/register", data);
  return response.data;
};