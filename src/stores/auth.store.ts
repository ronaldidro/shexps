import { defineStore } from "pinia";
import { ref } from "vue";
import { authService } from "@/services/auth.service";
import type { LoginPayload } from "@/types/auth";
import type { User } from "@/types/user";
import { clearAuthSession } from "@/utils/auth";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(localStorage.getItem("access_token"));

  const login = async (payload: LoginPayload) => {
    const response = await authService.signIn(payload);

    token.value = response.accessToken;

    localStorage.setItem("access_token", response.accessToken);

    await fetchUser();
  };

  const fetchUser = async () => {
    const me = await authService.me();
    user.value = me;
  };

  const logout = () => {
    user.value = null;
    token.value = null;

    clearAuthSession();
  };

  return { user, token, login, fetchUser, logout };
});
