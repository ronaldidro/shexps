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
    const isSignInRequest = requestUrl?.includes("/sign-in");

    if (status === 401 && !isSignInRequest) router.push({ name: "sign-in" });

    return Promise.reject(error);
  },
);

export default api;
