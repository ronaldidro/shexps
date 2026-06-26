import type { PaginatedData, QueryParams } from '@/types/pagination'
import api, { getErrorMessage } from '@/services/axios'
import type { Payment, PaymentPayload } from '@/types/payment'

export const paymentsService = {
  async getAll(params: QueryParams) {
    try {
      const response = await api.get<PaginatedData<Payment>>('/payments', {
        params,
      })
      return response.data
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  },

  async get(id: string) {
    const { data } = await api.get<Payment>(`/payments/${id}`)
    return data
  },

  async getReport(id: string) {
    const { data } = await api.get<Blob>(`/payments/${id}/report`, { responseType: 'blob' })
    return data
  },

  async create(payload: PaymentPayload) {
    const { data } = await api.post<Payment>('/payments', payload)
    return data
  },

  async remove(id: string) {
    const { data } = await api.delete<Payment>(`/payments/${id}`)
    return data
  },
}
