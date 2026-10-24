import { useMutation, useQueryClient, type QueryKey } from '@tanstack/vue-query'
import { useNotification } from '@/composables/useNotification'
import { getErrorMessage } from '@/services/axios'

export const useQueryMutation = () => {
  const queryClient = useQueryClient()
  const { showToast } = useNotification()

  return <TData, TVariables>(
    mutationFn: (vars: TVariables) => Promise<TData>,
    queryKey?: QueryKey,
  ) =>
    useMutation({
      mutationFn,
      onSuccess: () => {
        if (queryKey) queryClient.invalidateQueries({ queryKey })
      },
      onError: (err) => {
        showToast({ severity: 'error', summary: 'Error', detail: getErrorMessage(err) })
      },
    })
}
