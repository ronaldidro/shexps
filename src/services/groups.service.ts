import type { Group, GroupPayload } from '@/types/group'
import api, { getErrorMessage } from '@/services/axios'

export const groupsService = {
  async getAll() {
    try {
      const response = await api.get<Group[]>('/groups')
      return response.data
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  },

  async get(id: string) {
    try {
      const response = await api.get<Group>(`/groups/${id}`)
      return response.data
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  },

  async create(payload: GroupPayload) {
    const { data } = await api.post<Group>('/groups', payload)
    return data
  },

  async update(id: string, payload: GroupPayload) {
    const { data } = await api.patch<Group>(`/groups/${id}`, payload)
    return data
  },

  async remove(id: string) {
    const { data } = await api.delete<Group>(`/groups/${id}`)
    return data
  },
}
