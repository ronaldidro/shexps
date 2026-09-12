import api, { getErrorMessage } from '@/services/axios'
import type { Notification, NotificationPayload } from '@/types/notification'
import type { PaginatedData, QueryParams } from '@/types/pagination'

export const notificationsService = {
  async getAll(params: QueryParams) {
    try {
      const response = await api.get<PaginatedData<Notification>>('/notifications', {
        params,
      })
      return response.data
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  },

  async update(id: string, payload: NotificationPayload) {
    const { data } = await api.patch<Notification>(`/notifications/${id}`, payload)
    return data
  },

  async remove(id: string) {
    const { data } = await api.delete<Notification>(`/notifications/${id}`)
    return data
  },
}
