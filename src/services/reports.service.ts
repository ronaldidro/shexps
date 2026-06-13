import type { QueryParams } from '@/types/pagination'
import api from '@/services/axios'

export const reportsService = {
  async create(params: QueryParams & { type: 'expense' | 'payment' }): Promise<Blob> {
    const response = await api.get('/reports', { params, responseType: 'blob' })
    return response.data
  },
}
