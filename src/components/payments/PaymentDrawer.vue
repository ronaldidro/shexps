<template>
  <Drawer
    v-if="payment"
    :visible="visible"
    @update:visible="$emit('update:visible', false)"
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
          <div class="text-surface-900 dark:text-surface-0 font-medium">Fecha registro</div>
          <div class="text-muted-color">{{ payment.createdAt }}</div>
        </div>
        <div class="flex flex-col gap-1">
          <div class="text-surface-900 dark:text-surface-0 font-medium text-right">
            Fecha cierre
          </div>
          <div class="text-muted-color">{{ payment.closedAt }}</div>
        </div>
      </div>
      <hr class="m-0!" />
      <div class="flex justify-between items-center">
        <span class="font-semibold text-lg">Deuda acumulada</span>
        <span class="font-semibold text-lg">S/{{ payment.debt }}</span>
      </div>
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-4">
          <Tag :value="payment.payer.firstName" />
          <i class="pi pi-arrow-right" />
          <Tag :value="payment.user.firstName" severity="secondary" />
        </div>
        <span class="text-2xl font-semibold">S/{{ payment.amount }}</span>
      </div>
      <div v-if="Number(payment.remaining) > 0" class="flex justify-between items-center">
        <span class="font-medium dark:font-normal">Saldo pendiente de pago</span>
        <span class="font-medium dark:font-normal">S/{{ payment.remaining }}</span>
      </div>
      <hr class="m-0!" />
      <div class="flex flex-col gap-1">
        <div class="text-surface-900 dark:text-surface-0 font-medium">Descripción</div>
        <div class="text-muted-color">{{ payment.description }}</div>
      </div>
    </div>
  </Drawer>
</template>

<script setup lang="ts">
import type { Payment } from '@/types/payment'
import { PAY_DESCRIPTION } from '@/utils'

defineProps<{ visible: boolean; payment: Payment | null }>()

defineEmits<{ (e: 'update:visible', value: boolean): void }>()
</script>
