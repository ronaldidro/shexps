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
    <DataView v-if="expenses" :value="expenses.data">
      <template #list="slotProps">
        <div v-for="(item, index) in slotProps.items" :key="index">
          <div
            class="flex justify-between p-6"
            :class="{ 'border-t border-surface': index !== 0 }"
          >
            <div class="flex flex-col">
              <p
                class="font-medium text-surface-500 dark:text-surface-400 text-sm"
              >
                {{ item.createdAt }}
              </p>
              <span class="text-xl font-semibold">S/{{ item.amount }}</span>
              <span
                class="font-medium text-surface-500 dark:text-surface-400 text-lg"
              >
                {{ item.description }}
              </span>
            </div>
            <div class="flex gap-3">
              <Button
                icon="pi pi-eye"
                rounded
                outlined
                @click="openDrawer(item.id)"
              />
              <Button
                icon="pi pi-trash"
                severity="danger"
                rounded
                outlined
                @click="openConfirmDialog(item.id)"
              />
            </div>
          </div>
        </div>
      </template>
    </DataView>
    <ViewExpense v-model:visible="showDrawer" :id="selectedId" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { expensesService } from "@/services/expenses.service";
import type { Expense } from "@/types/expense";
import type { PaginatedData } from "@/types/pagination";
import AppBreadcrumb from "@/layout/AppBreadcrumb.vue";
import ViewExpense from "@/components/expenses/ViewExpense.vue";
import { useConfirm, useToast } from "primevue";
import { isAxiosError } from "axios";
import router from "@/router";

const expenses = ref<PaginatedData<Expense>>();
const selectedId = ref<string | null>(null);
const showDrawer = ref(false);

const confirm = useConfirm();
const toast = useToast();

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

    expenses.value = await expensesService.getAll();
  } catch (err) {
    const message = isAxiosError(err)
      ? err.response?.data?.message || err.message
      : "Ocurrió un error inesperado";

    toast.add({
      severity: "error",
      summary: "Error",
      detail: message,
      life: 3000,
    });
  }
};

onMounted(async () => (expenses.value = await expensesService.getAll()));
</script>
