import { useQuery } from '@tanstack/vue-query'
import type { User, UserPayload } from '@/types/user'
import { usersService } from '@/services/users.service'
import { useQueryMutation } from '@/composables/query/useQueryMutation'

export const useUserQuery = () => {
  const mutation = useQueryMutation()

  const queryKey = ['users']

  const read = () => useQuery({ queryKey, queryFn: () => usersService.getAll() })

  const create = () =>
    mutation<User, UserPayload>((payload) => usersService.create(payload), queryKey)

  const update = () =>
    mutation<User, { id: string; payload: UserPayload }>(
      ({ id, payload }) => usersService.update(id, payload),
      queryKey,
    )

  const remove = () => mutation<User, string>((id) => usersService.remove(id), queryKey)

  return { read, create, update, remove }
}
