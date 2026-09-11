<template>
  <div class="flex justify-between">
    <div class="flex flex-col">
      <p class="font-medium text-surface-500 dark:text-surface-400 text-sm">
        {{ payment.createdAt }}
      </p>
      <span class="text-xl font-semibold">S/{{ payment.amount }}</span>
      <span class="font-medium text-surface-500 dark:text-surface-400 text-lg line-clamp-1">
        {{ payment.description }}
      </span>
    </div>
    <div class="flex gap-3">
      <Button
        icon="pi pi-file-pdf"
        rounded
        severity="secondary"
        :loading="loadingReportButton"
        @click="$emit('report', payment.id)"
      />
      <Button icon="pi pi-eye" rounded @click="$emit('show', payment.id)" />
      <Button
        v-if="showDeleteButton"
        icon="pi pi-times"
        severity="danger"
        rounded
        @click="$emit('delete', payment.id)"
      />
    </div>
  </div>
  <div class="flex justify-between mt-2">
    <Tag :value="payment.payer.firstName" />
    <Tag :value="payment.group.name" severity="secondary" />
  </div>
</template>

<script setup lang="ts">
import type { Payment } from '@/types/payment'

defineProps<{ payment: Payment; showDeleteButton: boolean; loadingReportButton: boolean }>()

defineEmits<{
  (e: 'report', value: string): void
  (e: 'show', value: string): void
  (e: 'delete', value: string): void
}>()
</script>
