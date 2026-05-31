import { defineStore } from "pinia";
import { reactive } from "vue";
import { authService } from "@/services/auth.service";
import type { SignInPayload } from "@/types/auth";
import router from "@/router";

export const useAuthStore = defineStore(
  "auth",
  () => {
    const user = reactive<{ token: string | null; id: string | null }>({
      token: null,
      id: null,
    });

    const signIn = async (payload: SignInPayload) => {
      const response = await authService.signIn(payload);
      user.token = response.accessToken;

      const me = await authService.me();
      user.id = me.id;

      router.push({ name: "dashboard" });
    };

    const logout = () => {
      user.token = null;
      user.id = null;

      router.push({ name: "sign-in" });
    };

    return { user, signIn, logout };
  },
  { persist: true },
);
