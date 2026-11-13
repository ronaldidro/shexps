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
import type { ExpensePayload } from '@/types/expense'
import { useNotification } from '@/composables/useNotification'
import { usePreviewDialog } from '@/composables/usePreviewDialog'
import { useExpenseQuery } from '@/composables/query/useExpenseQuery'
import { useAuthStore } from '@/stores/auth.store'
import router from '@/router'

const { showToast } = useNotification()
const { openPreview } = usePreviewDialog()
const { user } = useAuthStore()
const { create } = useExpenseQuery()
const route = useRoute()

const { mutateAsync: createExpense } = create()

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
    handleSave: () => add(payload),
  })

const add = async (payload: ExpensePayload) => {
  await createExpense(payload, {
    onSuccess: () => {
      showToast({ severity: 'success', summary: 'Gasto registrado correctamente' })
      router.push({ name: 'expenses' })
    },
  })
  return true
}
</script>
