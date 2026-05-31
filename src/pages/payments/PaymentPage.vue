<template>
  <AppBreadcrumb
    :items="[
      { label: 'Movimientos' },
      { label: 'Pagos', route: '/payments' },
      { label: 'Nuevo' },
    ]"
  />
  <div class="card p-5! md:max-w-sm">
    <PaymentForm @submit="onSubmit" />
  </div>
</template>

<script setup lang="ts">
import AppBreadcrumb from "@/layout/AppBreadcrumb.vue";
import PaymentForm from "@/components/payments/PaymentForm.vue";
import { getErrorMessage } from "@/services/axios";
import { paymentsService } from "@/services/payments.service";
import type { PaymentPayload } from "@/types/payment";
import { useToast } from "primevue";
import router from "@/router";

const toast = useToast();

const onSubmit = async (values: PaymentPayload) => {
  try {
    await paymentsService.create(values);

    toast.add({
      severity: "success",
      summary: "Pago registrado correctamente",
      life: 3000,
    });

    router.push({ name: "payments" });
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
