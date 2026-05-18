import { defineStore } from "pinia";
import { ref } from "vue";
import { authService } from "@/services/auth.service";
import type { SignInPayload } from "@/types/auth";
import router from "@/router";

export const useAuthStore = defineStore(
  "auth",
  () => {
    const token = ref<string | null>(null);

    const signIn = async (payload: SignInPayload) => {
      const response = await authService.signIn(payload);
      token.value = response.accessToken;
      router.push({ name: "dashboard" });
    };

    const logout = () => {
      token.value = null;
      router.push({ name: "sign-in" });
    };

    return { token, signIn, logout };
  },
  { persist: true },
);
