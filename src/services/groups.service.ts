import type { Group, GroupPayload } from "@/types/group";
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

  async create(payload: GroupPayload) {
    const { data } = await api.post<Group>("/groups", payload);
    return data;
  },

  async update(id: string, payload: GroupPayload) {
    const { data } = await api.patch<Group>(`/groups/${id}`, payload);
    return data;
  },

  async remove(id: string) {
    const { data } = await api.delete<Group>(`/groups/${id}`);
    return data;
  },
};
