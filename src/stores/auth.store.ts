import { defineStore } from "pinia";
import { ref } from "vue";
import { authService } from "@/services/auth.service";
import type { LoginPayload } from "@/types/auth";
import router from "@/router";

export const useAuthStore = defineStore(
  "auth",
  () => {
    const token = ref<string | null>(null);

    const login = async (payload: LoginPayload) => {
      const response = await authService.signIn(payload);
      token.value = response.accessToken;
      router.push("/");
    };

    const logout = () => {
      token.value = null;
      router.push("/login");
    };

    return { token, login, logout };
  },
  { persist: true },
);
