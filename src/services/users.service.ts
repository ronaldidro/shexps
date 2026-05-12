import api from "./axios";
import type { User, UpdateUserPayload } from "@/types/user";

export const usersService = {
  async update(userId: number, payload: UpdateUserPayload) {
    const { data } = await api.patch<User>(`/users/${userId}`, payload);
    return data;
  },
};
