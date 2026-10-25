import { useQuery } from '@tanstack/vue-query'
import type { UpdatePasswordPayload, User, UserPayload, UserQueryParams } from '@/types/user'
import { usersService } from '@/services/users.service'
import { useQueryMutation } from '@/composables/query/useQueryMutation'

export const useUserQuery = () => {
  const mutation = useQueryMutation()

  const queryKey = ['users']

  const findAll = (params?: UserQueryParams) =>
    useQuery({ queryKey, queryFn: () => usersService.getAll(params) })

  const findOne = (id: string) =>
    useQuery({ queryKey: [...queryKey, id], queryFn: () => usersService.get(id) })

  const create = () =>
    mutation<User, UserPayload>((payload) => usersService.create(payload), queryKey)

  const update = ({ withKey = true }: { withKey?: boolean } = {}) =>
    mutation<User, { id: string; payload: UserPayload }>(
      ({ id, payload }) => usersService.update(id, payload),
      withKey ? queryKey : undefined,
    )

  const updatePassword = () =>
    mutation<User, { payload: UpdatePasswordPayload }>(({ payload }) =>
      usersService.updatePassword(payload),
    )

  const remove = () => mutation<User, string>((id) => usersService.remove(id), queryKey)

  return { findAll, findOne, create, update, updatePassword, remove }
}
