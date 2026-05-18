import type { User } from "@/types/user";
import type { SignInPayload, SignInResponse } from "@/types/auth";
import api from "./axios";

export const authService = {
  async signIn(payload: SignInPayload) {
    const { data } = await api.post<SignInResponse>("/auth/sign-in", payload);
    return data;
  },

  async me() {
    const { data } = await api.get<User>("/auth/me");
    return data;
  },
};
