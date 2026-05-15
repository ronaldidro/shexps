import router from "@/router";
import { useAuthStore } from "@/stores/auth.store";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const authStore = useAuthStore();

  if (authStore.token)
    config.headers.Authorization = `Bearer ${authStore.token}`;

  return config;
});

api.interceptors.response.use(
  (response) => response,

  (error) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url;
    const isLoginRequest = requestUrl?.includes("/auth/sign-in");

    if (status === 401 && !isLoginRequest) router.push("/login");

    return Promise.reject(error);
  },
);

export default api;
