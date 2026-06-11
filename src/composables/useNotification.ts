import { useToast, type ToastMessageOptions } from 'primevue'

export const useNotification = () => {
  const toast = useToast()

  const showToast = (options: ToastMessageOptions) =>
    toast.add({ ...options, life: options.life || 4500 })

  return { showToast }
}
