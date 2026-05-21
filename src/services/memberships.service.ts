import type { Membership } from "@/types/membership";
import api from "./axios";

export const membershipsService = {
  async getAll(params: {}) {
    const { data } = await api.get<Membership[]>("/memberships", { params });
    return data;
  },
};
