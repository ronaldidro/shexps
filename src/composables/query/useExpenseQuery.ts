import { computed, toValue, type MaybeRefOrGetter, type Ref } from 'vue'
import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/vue-query'
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
      staleTime: 1000 * 30,
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

  const findSummary = (params: MaybeRefOrGetter<Partial<QueryParams>>) => {
    const query = computed(() => toValue(params))

    return useQuery({
      queryKey: [...queryKey, 'summary', query],
      queryFn: () => expensesService.getSummary(query.value),
      enabled: () => {
        const q = query.value
        return !!(q.group && q.startDate && q.endDate)
      },
      placeholderData: keepPreviousData,
      staleTime: 1000 * 30,
    })
  }

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
