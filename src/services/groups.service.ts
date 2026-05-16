import type { Group } from "@/types/group";
import api from "./axios";

export const groupsService = {
  async getAll() {
    const { data } = await api.get<Group[]>("/groups");
    return data;
  },

  async get(id: string) {
    const { data } = await api.get<Group>(`/groups/${id}`);
    return data;
  },
};
