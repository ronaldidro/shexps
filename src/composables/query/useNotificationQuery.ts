import type { Ref } from 'vue'
import { useInfiniteQuery, useQueryClient } from '@tanstack/vue-query'
import type { QueryParams } from '@/types/pagination'
import type { Notification, NotificationPayload } from '@/types/notification'
import { useQueryMutation } from '@/composables/query/useQueryMutation'
import { notificationsService } from '@/services/notifications.service'

export const useNotificationQuery = () => {
  const mutation = useQueryMutation()
  const queryClient = useQueryClient()
  const queryKey = ['notifications']

  const findAll = (params?: Ref<Partial<QueryParams>>) =>
    useInfiniteQuery({
      queryKey: [...queryKey, params],
      queryFn: ({ pageParam = 1 }) =>
        notificationsService.getAll({ ...params?.value, page: pageParam, limit: 10 }),
      initialPageParam: 1,
      getNextPageParam: ({ meta }) => (meta.page < meta.lastPage ? meta.page + 1 : undefined),
      staleTime: 1000 * 30,
      select: (data) => ({
        items: data.pages.flatMap((page) => page.data),
        meta: data.pages[data.pages.length - 1]?.meta,
      }),
    })

  const update = () =>
    mutation<Notification, { id: string; payload: NotificationPayload }>(
      ({ id, payload }) => notificationsService.update(id, payload),
      queryKey,
    )

  const updateAll = () =>
    mutation<Notification, { payload: NotificationPayload }>(
      ({ payload }) => notificationsService.updateAll(payload),
      queryKey,
    )

  const remove = () =>
    mutation<Notification, string>((id) => notificationsService.remove(id), queryKey)

  const updateQueryList = () => queryClient.invalidateQueries({ queryKey })

  return { findAll, update, updateAll, remove, updateQueryList }
}
