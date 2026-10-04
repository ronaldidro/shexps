import { ref } from 'vue'
import { useNotification } from '@/composables/useNotification'
import { getError, getErrorMessage } from '@/services/axios'
import { HTTP_STATUS_CODE } from '@/utils'

export const useReport = <T>(reporter: (params: T) => Promise<Blob>) => {
  const { showToast } = useNotification()
  const reporting = ref(false)
  const activeParam = ref<T | null>(null)

  const handleReport = async (values: T) => {
    try {
      reporting.value = true
      activeParam.value = values

      const blob = await reporter(values)
      const url = URL.createObjectURL(blob)

      window.open(url, '_blank')

      setTimeout(() => URL.revokeObjectURL(url), 1000)
    } catch (err) {
      const error = getError(err)

      if (error && error.status === HTTP_STATUS_CODE.NOT_FOUND) {
        showToast({ severity: 'warn', summary: 'No se encontraron resultados' })
        return
      }

      showToast({ severity: 'error', summary: 'Error', detail: getErrorMessage(err) })
    } finally {
      reporting.value = false
      activeParam.value = null
    }
  }

  return { handleReport, reporting, activeParam }
}
