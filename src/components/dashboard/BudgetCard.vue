<template>
  <div class="card mb-0! flex flex-col gap-4">
    <CardHeader title="Presupuesto" variant="teal" icon="pi-calculator" />
    <ProgressBar
      :value="Number(membership.percent.toFixed(2))"
      :pt="{ value: { class: { 'bg-red-500!': membership.percent >= 100 } } }"
    />
    <div class="flex items-center justify-between">
      <span class="font-medium">Monto establecido</span>
      <Chip :label="formatCurrency(membership.budget)" />
    </div>
    <div class="flex items-center justify-between">
      <span class="font-medium">Gasto total</span>
      <Tag
        :severity="`${membership.percent >= 100 ? 'danger' : 'success'}`"
        :value="formatCurrency(membership.total)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ExpenseSummary } from '@/types/expense'
import CardHeader from '@/components/dashboard/CardHeader.vue'
import { formatCurrency } from '@/utils'

defineProps<{ membership: ExpenseSummary['membership'] }>()
</script>
