<template>
  <AppBreadcrumb :items="[{ label: 'Pagos', route: '/payments' }, { label: 'Nuevo' }]" />
  <div class="card p-5! md:max-w-sm">
    <Stepper v-model:value="activeStep" linear class="basis-200">
      <StepList>
        <Step value="1">Datos</Step>
        <Step value="2">Resumen</Step>
      </StepList>
      <StepPanels>
        <StepPanel value="1">
          <PaymentForm @submit="onSubmit" />
        </StepPanel>
        <StepPanel v-slot="{ activateCallback }" value="2">
          <PaymentPreview v-if="payment" :payment="payment.preview" />
          <div class="flex pt-5 justify-between">
            <Button
              label="Regresar"
              severity="secondary"
              icon="pi pi-arrow-left"
              @click="activateCallback('1')"
            />
            <Button label="Guardar" icon="pi pi-check" :loading="isPending" @click="save" />
          </div>
        </StepPanel>
      </StepPanels>
    </Stepper>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { PaymentPayload, PaymentPreview as PaymentPreviewType } from '@/types/payment'
import AppBreadcrumb from '@/layout/AppBreadcrumb.vue'
import PaymentForm from '@/components/payments/PaymentForm.vue'
import PaymentPreview from '@/components/previews/PaymentPreview.vue'
import { useNotification } from '@/composables/useNotification'
import { usePaymentQuery } from '@/composables/query/usePaymentQuery'
import { useAuthStore } from '@/stores/auth.store'
import router from '@/router'

const { showToast } = useNotification()
const { user } = useAuthStore()
const { create } = usePaymentQuery()

const { mutate: createPayment, isPending } = create()

const activeStep = ref('1')
const payment = ref<{ payload: PaymentPayload; preview: PaymentPreviewType }>()

const onSubmit = (payload: PaymentPayload, preview: PaymentPayload) => {
  const remaining = payload.debt - payload.amount
  payment.value = { payload: { ...payload, remaining }, preview: { ...preview, remaining, user } }
  activeStep.value = '2'
}

const save = () => {
  if (!payment.value) return

  createPayment(payment.value.payload, {
    onSuccess: () => {
      showToast({ severity: 'success', summary: 'Pago registrado correctamente' })
      router.push({ name: 'payments' })
    },
  })
}
</script>
