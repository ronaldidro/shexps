import api from "./axios";
import type { Expense } from "@/types/expense";
import type { PaginatedData } from "@/types/pagination";

export const expensesService = {
  async getAll() {
    const { data } = await api.get<PaginatedData<Expense>>("/expenses");
    return data;
  },

  async get(id: string) {
    const { data } = await api.get<Expense>(`/expenses/${id}`);
    return data;
  },

  async remove(id: string) {
    const { data } = await api.delete<Expense>(`/expenses/${id}`);
    return data;
  },
};
