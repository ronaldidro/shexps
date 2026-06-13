import { ref } from 'vue'
import { useNotification } from '@/composables/useNotification'
import { getError, getErrorMessage } from '@/services/axios'
import { reportsService } from '@/services/reports.service'
import type { QueryParams } from '@/types/pagination'
import type { ReportType } from '@/types/report'

export const useReport = (type: ReportType) => {
  const { showToast } = useNotification()
  const reporting = ref(false)

  const handleReport = async (values: QueryParams) => {
    try {
      reporting.value = true
      const blob = await reportsService.create({ ...values, type })
      const url = URL.createObjectURL(blob)

      window.open(url, '_blank')

      setTimeout(() => URL.revokeObjectURL(url), 1000)
    } catch (err) {
      const error = getError(err)

      if (error && error.status === 404) {
        showToast({ severity: 'warn', summary: 'No se encontraron gastos' })
        return
      }

      showToast({ severity: 'error', summary: 'Error', detail: getErrorMessage(err) })
    } finally {
      reporting.value = false
    }
  }

  return { handleReport, reporting }
}
