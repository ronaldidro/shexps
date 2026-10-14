<template>
  <AppBreadcrumb :items="[{ label: 'Gastos', route: '/expenses' }, { label: 'Nuevo' }]" />
  <div class="card p-5! md:max-w-sm">
    <ExpenseForm @submit="onSubmit" :initialData="queryValues" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppBreadcrumb from '@/layout/AppBreadcrumb.vue'
import ExpenseForm from '@/components/expenses/ExpenseForm.vue'
import { expensesService } from '@/services/expenses.service'
import { getErrorMessage } from '@/services/axios'
import type { ExpensePayload } from '@/types/expense'
import { useNotification } from '@/composables/useNotification'
import { usePreviewDialog } from '@/composables/usePreviewDialog'
import router from '@/router'
import { useAuthStore } from '@/stores/auth.store'

const { showToast } = useNotification()
const { openPreview } = usePreviewDialog()
const { user } = useAuthStore()
const route = useRoute()

const queryValues = computed(() => {
  return {
    description: (route.query.description as string) || '',
    amount: route.query.amount ? Number(route.query.amount) : null,
  }
})

const onSubmit = (payload: ExpensePayload, preview: ExpensePayload) =>
  openPreview({
    title: 'Nuevo gasto',
    data: { ...preview, user, type: 'expense' },
    handleSave: () => create(payload),
  })

const create = async (payload: ExpensePayload) => {
  try {
    await expensesService.create(payload)

    showToast({ severity: 'success', summary: 'Gasto registrado correctamente' })

    router.push({ name: 'expenses' })

    return true
  } catch (err) {
    showToast({ severity: 'error', summary: 'Error', detail: getErrorMessage(err) })
    return false
  }
}
</script>
