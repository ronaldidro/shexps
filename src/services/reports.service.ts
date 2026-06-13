import type { ReportQueryParams } from '@/types/report'
import api from '@/services/axios'

export const reportsService = {
  async create(params: ReportQueryParams): Promise<Blob> {
    const response = await api.get('/reports', { params, responseType: 'blob' })
    return response.data
  },
}
