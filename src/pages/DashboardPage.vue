<template>
  <AppBreadcrumb :items="[{ label: 'Movimientos' }, { label: 'Resumen' }]" />
  <div v-if="summary">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">      
      <div class="card mb-0! flex flex-col gap-4">
        <div class="flex items-center justify-between">
          <span class="block text-muted-color font-medium text-xl">
            Gastos
          </span>
          <div
            class="flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-border"
            style="width: 2.5rem; height: 2.5rem"
          >
            <i class="pi pi-dollar text-orange-500 text-xl!"></i>
          </div>
        </div>
        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">
          S/{{ summary.total }} en total
        </div>
        <div class="flex items-center justify-between"">
          <span class="font-medium">{{ summary.user }}</span>
          <Chip :label="`S/${summary.amount}`" />
        </div>
      </div>
      <div class="card mb-0! flex flex-col gap-4">
        <div class="flex items-center justify-between">
          <span class="block text-muted-color font-medium text-xl">
            Deudores
          </span>
          <div
            class="flex items-center justify-center bg-cyan-100 dark:bg-cyan-400/10 rounded-border"
            style="width: 2.5rem; height: 2.5rem"
          >
            <i class="pi pi-users text-cyan-500 text-xl!"></i>
          </div>
        </div>          
        <div
          v-for="debtor in summary.debtors"
          class="flex items-center justify-between"
        >
          <span class="font-medium">{{ debtor.fullName }}</span>
          <Chip :label="`S/${debtor.amount}`" />
        </div>
      </div>
    </div>    
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import AppBreadcrumb from "@/layout/AppBreadcrumb.vue";
import type { ExpenseSummary } from "@/types/expense";
import { expensesService } from "@/services/expenses.service";

const summary = ref<ExpenseSummary>();

onMounted(async () => {
  summary.value = await expensesService.getSummary();
});
</script>
