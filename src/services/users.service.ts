import api, { getErrorMessage } from '@/services/axios'
import type { User, UserPayload, UserQueryParams, UpdatePasswordPayload } from '@/types/user'

export const usersService = {
  async getAll(params?: UserQueryParams) {
    try {
      const response = await api.get<User[]>('/users', { params })
      return response.data
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  },

  async get(id: string) {
    try {
      const response = await api.get<User>(`/users/${id}`)
      return response.data
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  },

  async create(payload: UserPayload) {
    const { data } = await api.post<User>('/users', payload)
    return data
  },

  async update(id: string, payload: UserPayload) {
    const { data } = await api.patch<User>(`/users/${id}`, payload)
    return data
  },

  async updatePassword(payload: UpdatePasswordPayload) {
    const { data } = await api.patch<User>('/users/password', payload)
    return data
  },

  async remove(id: string) {
    const { data } = await api.delete<User>(`/users/${id}`)
    return data
  },
}
