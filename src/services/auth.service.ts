import type { User } from "@/types/user";
import type { LoginPayload, LoginResponse } from "@/types/auth";
import api from "./axios";

export const authService = {
  async signIn(payload: LoginPayload) {
    const { data } = await api.post<LoginResponse>("/auth/sign-in", payload);
    return data;
  },

  async me() {
    const { data } = await api.get<User>("/auth/me");
    return data;
  },
};
