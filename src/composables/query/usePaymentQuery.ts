import { type Ref } from 'vue'
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import type { Payment, PaymentPayload } from '@/types/payment'
import type { QueryParams } from '@/types/pagination'
import { useQueryMutation } from '@/composables/query/useQueryMutation'
import { paymentsService } from '@/services/payments.service'

export const usePaymentQuery = () => {
  const mutation = useQueryMutation()
  const queryClient = useQueryClient()
  const queryKey = ['payments']

  const findAll = (params?: Ref<Partial<QueryParams>>) =>
    useInfiniteQuery({
      queryKey: [...queryKey, params],
      queryFn: ({ pageParam = 1 }) =>
        paymentsService.getAll({ ...params?.value, page: pageParam, limit: 10 }),
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
      mutationFn: (id: string) => paymentsService.get(id),
      onSuccess: (data, id) => queryClient.setQueryData([...queryKey, id], data),
    })
  }

  const create = () =>
    mutation<Payment, PaymentPayload>((payload) => paymentsService.create(payload), queryKey)

  const remove = () => mutation<Payment, string>((id) => paymentsService.remove(id), queryKey)

  return { findAll, findOne, create, remove }
}
