<template>
  <div class="card mb-0! flex flex-col gap-4">
    <CardHeader :title :variant :icon />
    <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">
      {{ formatCurrency(total) }} en total
    </div>
    <div v-if="amount" class="flex items-center justify-between">
      <span class="font-medium">{{ firstName }}</span>
      <Chip :label="formatCurrency(amount)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import CardHeader, { type HeaderVariant } from '@/components/dashboard/CardHeader.vue'
import { formatCurrency } from '@/utils'

defineProps<{
  title: string
  variant: HeaderVariant
  icon: string
  total: number
  amount?: number
  firstName?: string
}>()
</script>
