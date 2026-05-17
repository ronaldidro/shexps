import api from "./axios";
import type { User, UpdateUserPayload } from "@/types/user";

export const usersService = {
  async getAll() {
    const { data } = await api.get<User[]>("/users");
    return data;
  },

  async update(id: string, payload: UpdateUserPayload) {
    const { data } = await api.patch<User>(`/users/${id}`, payload);
    return data;
  },
};
