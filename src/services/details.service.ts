import api, { getErrorMessage } from '@/services/axios'
import type { ExpenseDetail } from '@/types/expense'
import type { PaginatedData, QueryParams } from '@/types/pagination'

export const detailsService = {
  async getAll(params: QueryParams) {
    try {
      const response = await api.get<PaginatedData<ExpenseDetail>>('/details', {
        params,
      })
      return response.data
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  },

  async getSum(params: { debtor: string; group: string }) {
    const { data } = await api.get<number>('/details/sum', { params })
    return data
  },

  async getReport(params: QueryParams) {
    const { data } = await api.get<Blob>('/details/report', { params, responseType: 'blob' })
    return data
  },
}
