<template>
  <AppBreadcrumb :items="[{ label: 'Pagos', route: '/payments' }, { label: 'Nuevo' }]" />
  <div class="card p-5! md:max-w-sm">
    <PaymentForm @submit="onSubmit" />
  </div>
</template>

<script setup lang="ts">
import AppBreadcrumb from '@/layout/AppBreadcrumb.vue'
import PaymentForm from '@/components/payments/PaymentForm.vue'
import { getErrorMessage } from '@/services/axios'
import { paymentsService } from '@/services/payments.service'
import { useNotification } from '@/composables/useNotification'
import { usePreviewDialog } from '@/composables/usePreviewDialog'
import type { PaymentPayload } from '@/types/payment'
import { useAuthStore } from '@/stores/auth.store'
import router from '@/router'

const { showToast } = useNotification()
const { openPreview } = usePreviewDialog()
const { user } = useAuthStore()

const onSubmit = (payload: PaymentPayload, preview: PaymentPayload) => {
  const remaining = payload.debt - payload.amount

  openPreview({
    title: 'Nuevo pago',
    data: { ...preview, remaining, user, type: 'payment' },
    handleSave: () => create({ ...payload, remaining }),
  })
}

const create = async (values: PaymentPayload) => {
  try {
    await paymentsService.create(values)

    showToast({ severity: 'success', summary: 'Pago registrado correctamente' })

    router.push({ name: 'payments' })
  } catch (err) {
    showToast({ severity: 'error', summary: 'Error', detail: getErrorMessage(err) })
  }
}
</script>
