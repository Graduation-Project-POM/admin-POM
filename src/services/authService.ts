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

const clearSessionAndRedirect = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("role");
  localStorage.removeItem("userName");
  localStorage.removeItem("trainerId");
  if (!window.location.pathname.startsWith("/credentials")) {
    window.location.href = "/credentials/login";
  }
};

// Exchanges the refresh token for a new pair. Refresh tokens are single-use
// (rotated on every refresh) and shared by all tabs via localStorage, so:
//  - one refresh at a time per tab (`refreshing`), and
//  - Web Locks serialize tabs; a tab that waited finds the token already
//    replaced by another tab and just reuses the new one.
let refreshing: Promise<string | null> | null = null;

const doRefresh = async (expiredAccessToken: string): Promise<string | null> => {
  const current = localStorage.getItem("accessToken");
  if (current && current !== expiredAccessToken) return current;

  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) return null;
  try {
    // Plain axios, not `api`, so a failure here can't re-enter this interceptor.
    const { data } = await axios.post(`${API_URL}/Auth/refresh`, { refreshToken });
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    return data.accessToken as string;
  } catch {
    return null;
  }
};

const refreshAccessToken = (expiredAccessToken: string): Promise<string | null> => {
  if (!refreshing) {
    const run = () => doRefresh(expiredAccessToken);
    refreshing = (navigator.locks ? navigator.locks.request("pom-auth-refresh", run) : run())
      .finally(() => {
        refreshing = null;
      });
  }
  return refreshing;
};

const retried = new WeakSet<object>();

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;
    const config = error?.config;
    const url: string = config?.url ?? "";
    const isAuthCall = url.includes("/Auth/");

    // Expired access token: refresh silently and retry the request once, so
    // active users stay signed in. Deactivated accounts can't be refreshed.
    if (
      status === 401 &&
      !isAuthCall &&
      config &&
      !retried.has(config) &&
      error?.response?.data?.code !== "ACCOUNT_INACTIVE" &&
      localStorage.getItem("refreshToken")
    ) {
      const usedToken = String(config.headers?.Authorization ?? "").replace(/^Bearer /, "");
      const newToken = await refreshAccessToken(usedToken);
      if (newToken) {
        retried.add(config);
        config.headers.Authorization = `Bearer ${newToken}`;
        return api(config);
      }
    }

    if (status === 401 && !isAuthCall && localStorage.getItem("accessToken")) {
      clearSessionAndRedirect();
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