import type { Membership } from "@/types/membership";
import api, { getErrorMessage } from "@/services/axios";

export const membershipsService = {
  async getAll(params: { group: string }) {
    try {
      const response = await api.get<Membership[]>("/memberships", { params });
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};
