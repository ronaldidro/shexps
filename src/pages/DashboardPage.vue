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
          S/{{ summary.expenses }} en total
        </div>
        <div v-if="summary.amount" class="flex items-center justify-between">
          <span class="font-medium">{{ summary.user }}</span>
          <Chip :label="`S/${summary.amount}`" />
        </div>
        <div class="flex justify-between">
          <Button asChild v-slot="slotProps" text>
            <RouterLink :class="slotProps.class" :to="{ name: 'new-expense' }">
              <i class="pi pi-plus" /> Nuevo
            </RouterLink>
          </Button>
          <Button asChild v-slot="slotProps" text>
            <RouterLink :class="slotProps.class" :to="{ name: 'expenses' }">
              <i class="pi pi-eye" /> Ver
            </RouterLink>
          </Button>
        </div>
      </div>
      <div v-if="summary.debtors.length" class="card mb-0! flex flex-col gap-4">
        <div class="flex items-center justify-between">
          <span class="block text-muted-color font-medium text-xl">
            Te deben
          </span>
          <div
            class="flex items-center justify-center bg-cyan-100 dark:bg-cyan-400/10 rounded-border"
            style="width: 2.5rem; height: 2.5rem"
          >
            <i class="pi pi-money-bill text-cyan-500 text-xl!"></i>
          </div>
        </div>
        <div
          v-for="debtor in summary.debtors"
          class="flex items-center justify-between"
        >
          <span class="font-medium">{{ debtor.firstName }}</span>
          <Chip :label="`S/${debtor.amount}`" />
        </div>
      </div>
      <div class="card mb-0! flex flex-col gap-4">
        <div class="flex items-center justify-between">
          <span class="block text-muted-color font-medium text-xl">
            Deudas
          </span>
          <div
            class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-border"
            style="width: 2.5rem; height: 2.5rem"
          >
            <i class="pi pi-wallet text-blue-500 text-xl!"></i>
          </div>
        </div>
        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">
          S/{{ summary.debts }} en total
        </div>
        <div class="flex justify-end">
          <Button asChild v-slot="slotProps" text>
            <RouterLink :class="slotProps.class" :to="{ name: 'debts' }">
              <i class="pi pi-eye" /> Ver
            </RouterLink>
          </Button>
        </div>
      </div>
      <div
        v-if="summary.creditors.length"
        class="card mb-0! flex flex-col gap-4"
      >
        <div class="flex items-center justify-between">
          <span class="block text-muted-color font-medium text-xl">
            Le debes
          </span>
          <div
            class="flex items-center justify-center bg-purple-100 dark:bg-purple-400/10 rounded-border"
            style="width: 2.5rem; height: 2.5rem"
          >
            <i class="pi pi-credit-card text-purple-500 text-xl!"></i>
          </div>
        </div>
        <div
          v-for="creditor in summary.creditors"
          class="flex items-center justify-between"
        >
          <span class="font-medium">{{ creditor.firstName }}</span>
          <Chip :label="`S/${creditor.amount}`" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import AppBreadcrumb from "@/layout/AppBreadcrumb.vue";
import type { ExpenseSummary } from "@/types/expense";
import { expensesService } from "@/services/expenses.service";

const summary = reactive<ExpenseSummary>(await expensesService.getSummary());
</script>
