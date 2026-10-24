import type { Ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import type { Group, GroupPayload } from '@/types/group'
import type { Membership, MembershipPayload } from '@/types/membership'
import { groupsService } from '@/services/groups.service'
import { useQueryMutation } from '@/composables/query/useQueryMutation'
import { membershipsService } from '@/services/memberships.service'

export const useGroupQuery = () => {
  const mutation = useQueryMutation()

  const queryKey = ['groups']

  const findAll = (params?: Ref<{ search: string }>) =>
    useQuery({
      queryKey: [...queryKey, params],
      queryFn: () => groupsService.getAll(params?.value),
    })

  const findOne = (id: string) =>
    useQuery({ queryKey: [...queryKey, id], queryFn: () => groupsService.get(id) })

  const create = () =>
    mutation<Group, GroupPayload>((payload) => groupsService.create(payload), queryKey)

  const update = () =>
    mutation<Group, { id: string; payload: GroupPayload }>(
      ({ id, payload }) => groupsService.update(id, payload),
      queryKey,
    )

  const updateMembership = () =>
    mutation<Membership, { id: string; payload: MembershipPayload }>(
      ({ id, payload }) => membershipsService.update(id, payload),
      queryKey,
    )

  const remove = () => mutation<Group, string>((id) => groupsService.remove(id), queryKey)

  return { findAll, findOne, create, update, updateMembership, remove }
}
