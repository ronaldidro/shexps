<template>
  <div class="flex justify-between">
    <span class="font-medium text-surface-500 dark:text-surface-400 text-sm">
      {{ payment.createdAt }}
    </span>
    <Button
      type="button"
      icon="pi pi-ellipsis-v"
      @click="$emit('toggle', $event, payment)"
      class="p-button-text p-button-plain w-5!"
      aria-haspopup="true"
      aria-controls="overlay_menu"
    />
  </div>
  <span class="text-xl font-semibold">S/{{ payment.amount }}</span>
  <span class="font-medium text-surface-500 dark:text-surface-400 text-lg line-clamp-1">
    {{ payment.description }}
  </span>
  <div class="flex justify-between mt-2">
    <Tag :value="payment.payer.firstName" />
    <Tag :value="payment.group.name" severity="secondary" />
  </div>
</template>

<script setup lang="ts">
import type { Payment } from '@/types/payment'

defineProps<{ payment: Payment }>()

defineEmits<{ toggle: [event: Event, payment: Payment] }>()
</script>
