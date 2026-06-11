import api, { getErrorMessage } from '@/services/axios'
import type { Expense, ExpenseDetail, ExpensePayload, ExpenseSummary } from '@/types/expense'
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

  async getDetails(params: QueryParams) {
    try {
      const response = await api.get<PaginatedData<ExpenseDetail>>('/expenses/details', { params })
      return response.data
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  },

  async getDetailsSum(params: { debtor: string; group: string }) {
    const { data } = await api.get<number>('/expenses/details/sum', { params })
    return data
  },

  async getSummary() {
    try {
      const response = await api.get<ExpenseSummary>('/expenses/summary')
      return response.data
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
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
}
