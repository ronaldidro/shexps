<template>
  <AppBreadcrumb :items="[{ label: 'Movimientos' }, { label: 'Gastos' }]" />
  <Toolbar class="mb-7">
    <template #start>
      <IconField>
        <InputIcon>
          <i class="pi pi-search" />
        </InputIcon>
        <InputText placeholder="Buscar por descripción" />
      </IconField>
    </template>
    <template #end>
      <Button
        label="Nuevo"
        icon="pi pi-plus"
        @click="router.push({ name: 'new-expense' })"
      />
    </template>
  </Toolbar>
  <div class="card p-1!">
    <div ref="el" class="overflow-y-auto h-dvh">
      <div
        v-for="(expense, index) in expenses"
        :key="expense.id"
        class="mx-6 py-6"
        :class="{ 'border-t border-surface': index !== 0 }"
      >
        <div class="flex justify-between">
          <div class="flex flex-col">
            <p
              class="font-medium text-surface-500 dark:text-surface-400 text-sm"
            >
              {{ expense.expensedAt }}
            </p>
            <span class="text-xl font-semibold">S/{{ expense.amount }}</span>
            <span
              class="font-medium text-surface-500 dark:text-surface-400 text-lg line-clamp-1"
            >
              {{ expense.description }}
            </span>
          </div>
          <div class="flex gap-3">
            <Button icon="pi pi-eye" rounded @click="openDrawer(expense.id)" />
            <Button
              icon="pi pi-times"
              severity="danger"
              rounded
              @click="openConfirmDialog(expense.id)"
            />
          </div>
        </div>
        <div class="flex gap-2 mt-2">
          <Tag
            v-for="detail of expense.details"
            :key="detail.id"
            :value="detail.user.fullName"
            severity="info"
          />
        </div>
      </div>
      <p v-show="loading" class="text-center py-4">
        <i class="pi pi-spin pi-spinner" />
        Cargando...
      </p>
    </div>
  </div>
  <ExpenseDrawer v-model:visible="showDrawer" :id="selectedId" />
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from "vue";
import { expensesService } from "@/services/expenses.service";
import { getErrorMessage } from "@/services/axios";
import type { Expense } from "@/types/expense";
import AppBreadcrumb from "@/layout/AppBreadcrumb.vue";
import ExpenseDrawer from "@/components/expenses/ExpenseDrawer.vue";
import { useScrollPagination } from "@/composables/useScrollPagination";
import { useConfirm, useToast } from "primevue";
import router from "@/router";

const el = useTemplateRef("el");

const selectedId = ref<string | null>(null);
const showDrawer = ref(false);

const confirm = useConfirm();
const toast = useToast();

const {
  items: expenses,
  loading,
  reload,
} = await useScrollPagination<Expense>({
  el,
  limit: 10,
  fetcher: expensesService.getAll,
});

const openDrawer = (id: string) => {
  selectedId.value = id;
  showDrawer.value = true;
};

const openConfirmDialog = (id: string) => {
  confirm.require({
    header: "Eliminar gasto",
    message: "¿Está seguro de que desea continuar?",
    icon: "pi pi-exclamation-triangle",
    rejectProps: {
      label: "No",
      severity: "secondary",
      icon: "pi pi-times",
      text: true,
    },
    acceptProps: {
      label: "Sí",
      severity: "danger",
      icon: "pi pi-check",
      outlined: true,
    },
    accept: () => handleDelete(id),
  });
};

const handleDelete = async (id: string) => {
  try {
    await expensesService.remove(id);

    toast.add({
      severity: "success",
      summary: "Gasto eliminado correctamente",
      life: 3000,
    });

    await reload();
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
