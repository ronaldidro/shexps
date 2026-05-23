import api from "./axios";
import type { Expense, ExpensePayload, ExpenseSummary } from "@/types/expense";
import type { PaginatedData } from "@/types/pagination";

export const expensesService = {
  async getAll() {
    const { data } = await api.get<PaginatedData<Expense>>("/expenses");
    return data;
  },

  async getSummary() {
    const { data } = await api.get<ExpenseSummary>("/expenses/summary");
    return data;
  },

  async get(id: string) {
    const { data } = await api.get<Expense>(`/expenses/${id}`);
    return data;
  },

  async create(payload: ExpensePayload) {
    const { data } = await api.post<Expense>("/expenses", payload);
    return data;
  },

  async remove(id: string) {
    const { data } = await api.delete<Expense>(`/expenses/${id}`);
    return data;
  },
};
