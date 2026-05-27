<template>
  <AppBreadcrumb
    :items="[
      { label: 'Movimientos' },
      { label: 'Gastos', route: '/expenses' },
      { label: 'Nuevo' },
    ]"
  />
  <div class="card p-5! md:max-w-sm">
    <ExpenseForm @submit="onSubmit" />
  </div>
</template>

<script setup lang="ts">
import AppBreadcrumb from "@/layout/AppBreadcrumb.vue";
import ExpenseForm from "@/components/expenses/ExpenseForm.vue";
import { expensesService } from "@/services/expenses.service";
import { getErrorMessage } from "@/services/axios";
import type { ExpensePayload } from "@/types/expense";
import { useToast } from "primevue";
import router from "@/router";

const toast = useToast();

const onSubmit = async (payload: ExpensePayload) => {
  try {
    await expensesService.create(payload);

    toast.add({
      severity: "success",
      summary: "Gasto registrado correctamente",
      life: 3000,
    });

    router.push({ name: "expenses" });
  } catch (err) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: getErrorMessage(err),
      life: 3000,
    });
  }
};
</script>
