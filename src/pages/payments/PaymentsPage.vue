<template>
  <AppBreadcrumb :items="[{ label: 'Movimientos' }, { label: 'Pagos' }]" />
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
        @click="router.push({ name: 'new-payment' })"
      />
    </template>
  </Toolbar>
  <div class="card p-1!">
    <div ref="el" class="overflow-y-auto h-dvh">
      <div
        v-for="(payment, index) in payments"
        :key="payment.id"
        class="mx-6 py-6"
        :class="{ 'border-t border-surface': index !== 0 }"
      >
        <div class="flex justify-between">
          <div class="flex flex-col">
            <p
              class="font-medium text-surface-500 dark:text-surface-400 text-sm"
            >
              {{ payment.createdAt }}
            </p>
            <span class="text-xl font-semibold">S/{{ payment.amount }}</span>
            <span
              class="font-medium text-surface-500 dark:text-surface-400 text-lg line-clamp-1"
            >
              {{ payment.description }}
            </span>
          </div>
          <div class="flex gap-3">
            <Button icon="pi pi-eye" rounded @click="openDrawer(payment.id)" />
            <Button
              v-if="payment.user.id === user.id"
              icon="pi pi-times"
              severity="danger"
              rounded
              @click="openConfirmDialog(payment.id)"
            />
          </div>
        </div>
        <div class="flex items-center gap-2 mt-2">
          <span>De</span>
          <Tag :value="payment.payer.firstName" />
          <span>para</span>
          <Tag :value="payment.user.firstName" severity="secondary" />
        </div>
      </div>
      <p v-show="loading" class="text-center py-4">
        <i class="pi pi-spin pi-spinner" />
        Cargando...
      </p>
    </div>
  </div>
  <PaymentDrawer v-model:visible="showDrawer" :id="selectedId" />
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from "vue";
import { useConfirm } from "primevue";
import AppBreadcrumb from "@/layout/AppBreadcrumb.vue";
import PaymentDrawer from "@/components/payments/PaymentDrawer.vue";
import { useScrollPagination } from "@/composables/useScrollPagination";
import { paymentsService } from "@/services/payments.service";
import { getErrorMessage } from "@/services/axios";
import type { Payment } from "@/types/payment";
import router from "@/router";
import { useAuthStore } from "@/stores/auth.store";
import { useNotification } from "@/composables/useNotification";

const el = useTemplateRef("el");

const selectedId = ref<string | null>(null);
const showDrawer = ref(false);

const confirm = useConfirm();
const { user } = useAuthStore();
const { showToast } = useNotification();

const {
  items: payments,
  loading,
  reload,
} = await useScrollPagination<Payment>({
  el,
  limit: 10,
  fetcher: paymentsService.getAll,
});

const openDrawer = (id: string) => {
  selectedId.value = id;
  showDrawer.value = true;
};

const openConfirmDialog = (id: string) => {
  confirm.require({
    header: "Eliminar pago",
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
    await paymentsService.remove(id);

    showToast({ severity: "success", summary: "Pago eliminado correctamente" });

    await reload();
  } catch (err) {
    showToast({
      severity: "error",
      summary: "Error",
      detail: getErrorMessage(err),
    });
  }
};
</script>
