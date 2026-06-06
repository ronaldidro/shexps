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
import { useNotification } from "@/composables/useNotification";
import router from "@/router";
import { useAuthStore } from "@/stores/auth.store";
import { usePreviewDialog } from "@/composables/usePreviewDialog";

const { showToast } = useNotification();
const { user } = useAuthStore();
const { openPreview } = usePreviewDialog();

const onSubmit = (payload: ExpensePayload, preview: ExpensePayload) =>
  openPreview({
    title: "Nuevo gasto",
    data: { ...preview, user },
    handleSave: () => create(payload),
  });

const create = async (payload: ExpensePayload) => {
  try {
    await expensesService.create(payload);

    showToast({
      severity: "success",
      summary: "Gasto registrado correctamente",
    });

    router.push({ name: "expenses" });
  } catch (err) {
    showToast({
      severity: "error",
      summary: "Error",
      detail: getErrorMessage(err),
    });
  }
};
</script>
