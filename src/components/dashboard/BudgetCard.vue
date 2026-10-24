<template>
  <div class="card mb-0! flex flex-col gap-4">
    <CardHeader title="Presupuesto" variant="teal" icon="pi-calculator" />
    <ProgressBar
      :value="Number(percent.toFixed(2))"
      :pt="{ value: { class: { 'bg-red-500!': percent >= 100 } } }"
    />
    <div class="flex items-center justify-between">
      <span class="font-medium">{{ group }}</span>
      <Chip :label="formatCurrency(budget)" />
    </div>
    <div class="flex items-center justify-between">
      <span class="font-medium">Gasto total</span>
      <Tag :severity="`${percent >= 100 ? 'danger' : 'success'}`" :value="formatCurrency(total)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import CardHeader from '@/components/dashboard/CardHeader.vue'
import { formatCurrency } from '@/utils'

defineProps<{
  budget: number
  total: number
  percent: number
  group?: string
}>()
</script>
