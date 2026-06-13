<template>
  <AppBreadcrumb :items="[{ label: 'Movimientos' }, { label: 'Gastos' }]" />
  <Toolbar class="mb-5">
    <template #start>
      <SearchField v-model="search" @search="handleSearch" />
    </template>
    <template #end>
      <Button label="Nuevo" icon="pi pi-plus" @click="router.push({ name: 'new-expense' })" />
    </template>
  </Toolbar>
  <FilterPanel @submit="handleFilters" @report="handleReport" @clear="handleClear" />
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
            <p class="font-medium text-surface-500 dark:text-surface-400 text-sm">
              {{ expense.expensedAt }}
            </p>
            <span class="text-xl font-semibold">S/{{ expense.amount }}</span>
            <span class="font-medium text-surface-500 dark:text-surface-400 text-lg line-clamp-1">
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
        <div class="flex gap-2 mt-2 flex-wrap">
          <Tag
            v-for="detail of expense.details"
            :key="detail.id"
            :value="detail.user.firstName"
            severity="info"
          />
          <Tag
            v-if="expense.splitted || !expense.details.length"
            :value="expense.user.firstName"
            severity="info"
          />
        </div>
      </div>
      <p v-if="loading" class="text-center pt-5">
        <ProgressSpinner style="width: 50px; height: 50px" />
      </p>
      <p v-else-if="!expenses.length" class="text-center text-lg pt-5">
        <i class="pi pi-info-circle pr-2" />
        No se encontraron gastos
      </p>
      <ScrollTop
        target="parent"
        icon="pi pi-arrow-up"
        :buttonProps="{ severity: 'contrast', raised: true, rounded: true }"
      />
    </div>
  </div>
  <ExpenseDrawer v-model:visible="showDrawer" :id="selectedId" />
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { expensesService } from '@/services/expenses.service'
import { reportsService } from '@/services/reports.service'
import { getError, getErrorMessage } from '@/services/axios'
import type { Expense } from '@/types/expense'
import type { QueryParams } from '@/types/pagination'
import AppBreadcrumb from '@/layout/AppBreadcrumb.vue'
import ExpenseDrawer from '@/components/expenses/ExpenseDrawer.vue'
import SearchField from '@/components/SearchField.vue'
import FilterPanel from '@/components/FilterPanel.vue'
import { useScrollPagination } from '@/composables/useScrollPagination'
import { useNotification } from '@/composables/useNotification'
import { useConfirm } from 'primevue'
import router from '@/router'

const el = useTemplateRef('el')

const selectedId = ref<string | null>(null)
const showDrawer = ref(false)
const search = ref('')

const confirm = useConfirm()
const { showToast } = useNotification()

const {
  items: expenses,
  loading,
  reload,
  setFilters,
} = useScrollPagination<Expense>({ el, fetcher: expensesService.getAll })

const openDrawer = (id: string) => {
  selectedId.value = id
  showDrawer.value = true
}

const handleSearch = async (value: string) => {
  search.value = value
  await setFilters({ search: value })
}

const handleFilters = async (values: QueryParams) => {
  if (Object.values(values).every((value) => !value)) return
  await setFilters({ ...values })
}

const handleReport = async (values: QueryParams) => {
  try {
    const blob = await reportsService.create({ ...values, type: 'expense' })
    const url = URL.createObjectURL(blob)

    window.open(url, '_blank')

    setTimeout(() => URL.revokeObjectURL(url), 1000)
  } catch (err) {
    const error = getError(err)

    if (error && error.status === 404) {
      showToast({ severity: 'warn', summary: 'No se encontraron gastos' })
      return
    }

    showToast({ severity: 'error', summary: 'Error', detail: getErrorMessage(err) })
  }
}

const handleClear = async () => await reload()

const openConfirmDialog = (id: string) => {
  confirm.require({
    header: 'Eliminar gasto',
    message: '¿Está seguro de que desea continuar?',
    icon: 'pi pi-exclamation-triangle',
    rejectProps: {
      label: 'No',
      severity: 'secondary',
      icon: 'pi pi-times',
      text: true,
    },
    acceptProps: {
      label: 'Sí',
      severity: 'danger',
      icon: 'pi pi-check',
      outlined: true,
    },
    accept: () => handleDelete(id),
  })
}

const handleDelete = async (id: string) => {
  try {
    await expensesService.remove(id)

    showToast({
      severity: 'success',
      summary: 'Gasto eliminado correctamente',
    })

    await reload()
  } catch (err) {
    showToast({
      severity: 'error',
      summary: 'Error',
      detail: getErrorMessage(err),
    })
  }
}
</script>
