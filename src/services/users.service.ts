import api, { getErrorMessage } from '@/services/axios'
import type { User, UpdateUserPayload, UserQueryParams, UpdatePasswordPayload } from '@/types/user'

export const usersService = {
  async getAll(params: UserQueryParams) {
    try {
      const response = await api.get<User[]>('/users', { params })
      return response.data
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  },

  async update(id: string, payload: UpdateUserPayload) {
    const { data } = await api.patch<User>(`/users/${id}`, payload)
    return data
  },

  async updatePassword(payload: UpdatePasswordPayload) {
    const { data } = await api.patch<User>('/users/password', payload)
    return data
  },
}
