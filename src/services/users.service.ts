import api, { getErrorMessage } from "@/services/axios";
import type { User, UpdateUserPayload } from "@/types/user";

export const usersService = {
  async getAll() {
    try {
      const response = await api.get<User[]>("/users");
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },

  async update(id: string, payload: UpdateUserPayload) {
    const { data } = await api.patch<User>(`/users/${id}`, payload);
    return data;
  },
};
