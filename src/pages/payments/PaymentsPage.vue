<template>
  <AppBreadcrumb :items="[{ label: 'Pagos' }]" />
  <Toolbar class="mb-7">
    <template #start>
      <SearchField v-model="search" @search="handleSearch" />
    </template>
    <template #end>
      <Button label="Nuevo" icon="pi pi-plus" @click="router.push({ name: 'new-payment' })" />
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
            <p class="font-medium text-surface-500 dark:text-surface-400 text-sm">
              {{ payment.createdAt }}
            </p>
            <span class="text-xl font-semibold">S/{{ payment.amount }}</span>
            <span class="font-medium text-surface-500 dark:text-surface-400 text-lg line-clamp-1">
              {{ payment.description }}
            </span>
          </div>
          <div class="flex gap-3">
            <Button
              icon="pi pi-file-pdf"
              rounded
              severity="secondary"
              :loading="activeParam === payment.id"
              @click="handleReport(payment.id)"
            />
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
        <div class="flex justify-between mt-2">
          <Tag :value="payment.payer.firstName" />
          <Tag :value="payment.group.name" severity="secondary" />
        </div>
      </div>
      <p v-if="loading" class="text-center pt-5">
        <ProgressSpinner style="width: 50px; height: 50px" />
      </p>
      <p v-else-if="!payments.length" class="text-center text-lg pt-5">
        <i class="pi pi-info-circle pr-2" />
        No se encontraron pagos
      </p>
      <ScrollTop
        target="parent"
        icon="pi pi-arrow-up"
        :buttonProps="{ severity: 'contrast', raised: true, rounded: true }"
      />
    </div>
  </div>
  <PaymentDrawer v-model:visible="showDrawer" :id="selectedId" />
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { useConfirm } from 'primevue'
import type { Payment } from '@/types/payment'
import AppBreadcrumb from '@/layout/AppBreadcrumb.vue'
import PaymentDrawer from '@/components/payments/PaymentDrawer.vue'
import SearchField from '@/components/SearchField.vue'
import { useScrollPagination } from '@/composables/useScrollPagination'
import { useNotification } from '@/composables/useNotification'
import { useReport } from '@/composables/useReport'
import { paymentsService } from '@/services/payments.service'
import { getErrorMessage } from '@/services/axios'
import { useAuthStore } from '@/stores/auth.store'
import router from '@/router'

const el = useTemplateRef('el')

const selectedId = ref<string | null>(null)
const showDrawer = ref(false)
const search = ref('')

const confirm = useConfirm()
const { user } = useAuthStore()
const { showToast } = useNotification()
const { handleReport, activeParam } = useReport(paymentsService.getReport)

const {
  items: payments,
  loading,
  reload,
  setFilters,
} = useScrollPagination<Payment>({ el, fetcher: paymentsService.getAll })

const openDrawer = (id: string) => {
  selectedId.value = id
  showDrawer.value = true
}

const handleSearch = async (value: string) => {
  search.value = value
  await setFilters({ search: value })
}

const openConfirmDialog = (id: string) => {
  confirm.require({
    header: 'Eliminar pago',
    message: '¿Está seguro de que desea continuar?',
    icon: 'pi pi-exclamation-triangle',
    rejectProps: { label: 'No', severity: 'secondary', icon: 'pi pi-times', text: true },
    acceptProps: { label: 'Sí', severity: 'danger', icon: 'pi pi-check', outlined: true },
    accept: () => handleDelete(id),
  })
}

const handleDelete = async (id: string) => {
  try {
    await paymentsService.remove(id)

    showToast({ severity: 'success', summary: 'Pago eliminado correctamente' })

    await reload()
  } catch (err) {
    showToast({ severity: 'error', summary: 'Error', detail: getErrorMessage(err) })
  }
}
</script>
