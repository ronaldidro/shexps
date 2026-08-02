import api, { getErrorMessage } from '@/services/axios'
import type { Expense, ExpensePayload, ExpenseSummary } from '@/types/expense'
import type { PaginatedData, QueryParams } from '@/types/pagination'

export const expensesService = {
  async getAll(params: QueryParams) {
    try {
      const response = await api.get<PaginatedData<Expense>>('/expenses', {
        params,
      })
      return response.data
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  },

  async getSummary() {
    try {
      const response = await api.get<ExpenseSummary>('/expenses/summary')
      return response.data
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  },

  async getReport(params: QueryParams) {
    const { data } = await api.get<Blob>('/expenses/report', { params, responseType: 'blob' })
    return data
  },

  async get(id: string) {
    const { data } = await api.get<Expense>(`/expenses/${id}`)
    return data
  },

  async create(payload: ExpensePayload) {
    const { data } = await api.post<Expense>('/expenses', payload)
    return data
  },

  async remove(id: string) {
    const { data } = await api.delete<Expense>(`/expenses/${id}`)
    return data
  },

  async removeAll() {
    const { data } = await api.delete<Expense[]>('/expenses')
    return data
  },
}
