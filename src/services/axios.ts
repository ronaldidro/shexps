import { clearAuthSession } from "@/utils/auth";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");

  if (token) config.headers.Authorization = `Bearer ${token}`;

  return config;
});

api.interceptors.response.use(
  (response) => response,

  (error) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url;
    const isLoginRequest = requestUrl?.includes("/auth/sign-in");

    if (status === 401 && !isLoginRequest) clearAuthSession();

    return Promise.reject(error);
  },
);

export default api;
