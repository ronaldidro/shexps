<template>
  <Drawer
    v-if="payment"
    :visible="visible"
    @update:visible="close"
    header="Pago"
    position="bottom"
    style="height: auto"
  >
    <div class="flex flex-col gap-5">
      <div class="flex justify-between">
        <Tag severity="contrast" :value="PAY_DESCRIPTION[payment.method]" />
        <Tag :value="payment.group.name" />
      </div>
      <div class="flex justify-between">
        <div class="flex flex-col gap-1">
          <div class="text-surface-900 dark:text-surface-0 font-medium">Registro</div>
          <div class="text-muted-color">{{ payment.createdAt }}</div>
        </div>
        <div class="flex flex-col gap-1">
          <div class="text-surface-900 dark:text-surface-0 font-medium text-right">Cierre</div>
          <div class="text-muted-color">{{ payment.closedAt }}</div>
        </div>
      </div>
      <span class="font-medium text-xl">
        {{ payment.description }}
      </span>
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-4">
          <Tag :value="payment.payer.firstName" />
          <i class="pi pi-arrow-right" />
          <Tag :value="payment.user.firstName" severity="secondary" />
        </div>
        <span class="text-2xl font-semibold">S/{{ payment.amount }}</span>
      </div>
      <div v-if="Number(payment.remaining) > 0" class="flex justify-between items-center">
        <span class="font-semibold text-lg">Saldo pendiente de pago</span>
        <span class="font-semibold text-lg">S/{{ payment.remaining }}</span>
      </div>
      <div class="flex justify-between items-center">
        <span class="font-medium dark:font-normal">Deuda acumulada</span>
        <span class="font-medium dark:font-normal">S/{{ payment.debt }}</span>
      </div>
    </div>
  </Drawer>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Payment } from '@/types/payment'
import { paymentsService } from '@/services/payments.service'
import { PAY_DESCRIPTION } from '@/utils'

const props = defineProps<{
  visible: boolean
  id: string | null
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
}>()

const close = () => emit('update:visible', false)

const payment = ref<Payment>()

watch(
  () => props.visible,
  async (isVisible) => {
    if (!isVisible || !props.id) return
    payment.value = await paymentsService.get(props.id)
  },
)
</script>
