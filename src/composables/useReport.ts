import { ref } from 'vue'
import { useNotification } from '@/composables/useNotification'
import { getError, getErrorMessage } from '@/services/axios'

export const useReport = <T>(reporter: (params: T) => Promise<Blob>) => {
  const { showToast } = useNotification()
  const reporting = ref(false)

  const handleReport = async (values: T) => {
    try {
      reporting.value = true

      const blob = await reporter(values)
      const url = URL.createObjectURL(blob)

      window.open(url, '_blank')

      setTimeout(() => URL.revokeObjectURL(url), 1000)
    } catch (err) {
      const error = getError(err)

      if (error && error.status === 404) {
        showToast({ severity: 'warn', summary: 'No se encontraron resultados' })
        return
      }

      showToast({ severity: 'error', summary: 'Error', detail: getErrorMessage(err) })
    } finally {
      reporting.value = false
    }
  }

  return { handleReport, reporting }
}
