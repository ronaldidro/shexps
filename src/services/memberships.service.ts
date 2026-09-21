import api from '@/services/axios'
import type { Membership, MembershipPayload } from '@/types/membership'

export const membershipsService = {
  async update(id: string, payload: MembershipPayload) {
    const { data } = await api.patch<Membership>(`/memberships/${id}`, payload)
    return data
  },
}
