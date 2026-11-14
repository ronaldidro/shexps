<template>
  <AppBreadcrumb :items="[{ label: 'Pagos', route: '/payments' }, { label: 'Nuevo' }]" />
  <PaymentForm @submit="onSubmit" />
</template>

<script setup lang="ts">
import AppBreadcrumb from '@/layout/AppBreadcrumb.vue'
import PaymentForm from '@/components/payments/PaymentForm.vue'
import { useNotification } from '@/composables/useNotification'
import { usePreviewDialog } from '@/composables/usePreviewDialog'
import { usePaymentQuery } from '@/composables/query/usePaymentQuery'
import type { PaymentPayload } from '@/types/payment'
import { useAuthStore } from '@/stores/auth.store'
import router from '@/router'

const { showToast } = useNotification()
const { openPreview } = usePreviewDialog()
const { user } = useAuthStore()
const { create } = usePaymentQuery()

const { mutateAsync: createPayment } = create()

const onSubmit = (payload: PaymentPayload, preview: PaymentPayload) => {
  const remaining = payload.debt - payload.amount

  openPreview({
    title: 'Nuevo pago',
    data: { ...preview, remaining, user, type: 'payment' },
    handleSave: () => add({ ...payload, remaining }),
  })
}

const add = async (values: PaymentPayload) => {
  await createPayment(values, {
    onSuccess: () => showToast({ severity: 'success', summary: 'Pago registrado correctamente' }),
  })

  router.push({ name: 'payments' })

  return true
}
</script>
