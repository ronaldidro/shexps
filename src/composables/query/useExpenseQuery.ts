import type { Ref } from 'vue'
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { Expense, ExpensePayload } from '@/types/expense'
import type { QueryParams } from '@/types/pagination'
import { useQueryMutation } from '@/composables/query/useQueryMutation'
import { expensesService } from '@/services/expenses.service'

export const useExpenseQuery = () => {
  const mutation = useQueryMutation()
  const queryClient = useQueryClient()
  const queryKey = ['expenses']

  const findAll = (params?: Ref<Partial<QueryParams>>) =>
    useInfiniteQuery({
      queryKey: [...queryKey, params],
      queryFn: ({ pageParam = 1 }) =>
        expensesService.getAll({ ...params?.value, page: pageParam, limit: 10 }),
      initialPageParam: 1,
      getNextPageParam: ({ meta }) => (meta.page < meta.lastPage ? meta.page + 1 : undefined),
      select: (data) => ({
        items: data.pages.flatMap((page) => page.data),
        meta: data.pages[data.pages.length - 1]?.meta,
      }),
    })

  const findOne = () => {
    return useMutation({
      mutationFn: (id: string) => expensesService.get(id),
      onSuccess: (data, id) => queryClient.setQueryData([...queryKey, id], data),
    })
  }

  const findSummary = (params: Ref<Partial<QueryParams>>) =>
    useQuery({
      queryKey: [...queryKey, params],
      queryFn: () => expensesService.getSummary(params.value),
    })

  const create = () =>
    mutation<Expense, ExpensePayload>((payload) => expensesService.create(payload), queryKey)

  const remove = () => mutation<Expense, string>((id) => expensesService.remove(id), queryKey)

  const removeAll = () =>
    mutation<Expense[], { payload: QueryParams }>(
      ({ payload }) => expensesService.removeAll(payload),
      queryKey,
    )

  return { findAll, findOne, findSummary, create, remove, removeAll }
}
