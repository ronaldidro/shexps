<template>
  <AppBreadcrumb :items="[{ label: 'Gastos' }]" />
  <Toolbar class="mb-5">
    <template #start>
      <SearchField v-model="search" @search="handleSearch" />
    </template>
    <template #end>
      <Button label="Nuevo" icon="pi pi-plus" @click="router.push({ name: 'new-expense' })" />
    </template>
  </Toolbar>
  <FilterPanel
    @submit="handleFilters"
    @report="handleReport"
    @clear="handleClear"
    @delete="openDeleteFilterDialog"
    :showAuthUser="true"
    :reporting
  />
  <div class="card p-1!">
    <div ref="el" class="overflow-y-auto h-dvh">
      <div
        v-for="(expense, index) in expenses"
        :key="expense.id"
        class="mx-6 py-6"
        :class="{ 'border-t border-surface': index !== 0 }"
      >
        <ExpenseItem
          :expense="expense"
          :showDeleteButton="expense.user.id === user.id"
          @show="openDrawer"
          @delete="openDeleteDialog"
        />
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
import { useConfirm } from 'primevue'
import { expensesService } from '@/services/expenses.service'
import { getError, getErrorMessage } from '@/services/axios'
import type { Expense } from '@/types/expense'
import type { QueryParams } from '@/types/pagination'
import AppBreadcrumb from '@/layout/AppBreadcrumb.vue'
import ExpenseDrawer from '@/components/expenses/ExpenseDrawer.vue'
import ExpenseItem from '@/components/expenses/ExpenseItem.vue'
import SearchField from '@/components/SearchField.vue'
import FilterPanel from '@/components/FilterPanel.vue'
import { useScrollPagination } from '@/composables/useScrollPagination'
import { useNotification } from '@/composables/useNotification'
import { useReport } from '@/composables/useReport'
import { useAuthStore } from '@/stores/auth.store'
import router from '@/router'

const el = useTemplateRef('el')

const selectedId = ref<string | null>(null)
const showDrawer = ref(false)
const search = ref('')

const confirm = useConfirm()
const { user } = useAuthStore()
const { showToast } = useNotification()
const { handleReport, reporting } = useReport(expensesService.getReport)

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

const handleFilters = async (values: QueryParams) => await setFilters({ ...values })

const handleClear = async () => await reload()

const openDeleteDialog = (id: string) => {
  confirm.require({
    header: 'Eliminar gasto',
    message: '¿Está seguro de que desea continuar?',
    icon: 'pi pi-exclamation-triangle',
    rejectProps: { label: 'No', severity: 'secondary', icon: 'pi pi-times', text: true },
    acceptProps: { label: 'Sí', severity: 'danger', icon: 'pi pi-check', outlined: true },
    accept: () => handleDelete(id),
  })
}

const openDeleteFilterDialog = (values: QueryParams) =>
  confirm.require({
    header: 'Eliminar gastos filtrados',
    message: '¿Está seguro de que desea continuar?',
    icon: 'pi pi-info-circle',
    rejectProps: { label: 'No', severity: 'secondary', icon: 'pi pi-times', text: true },
    acceptProps: { label: 'Sí', severity: 'danger', icon: 'pi pi-check', outlined: true },
    accept: () => handleDeleteFilter(values),
  })

const handleDelete = async (id: string) => {
  try {
    await expensesService.remove(id)

    showToast({ severity: 'success', summary: 'Gasto eliminado correctamente' })

    await reload()
  } catch (err) {
    showToast({ severity: 'error', summary: 'Error', detail: getErrorMessage(err) })
  }
}

const handleDeleteFilter = async (values: QueryParams) => {
  try {
    await expensesService.removeAll(values)

    showToast({ severity: 'success', summary: 'Gastos eliminados correctamente' })

    await reload()
  } catch (err) {
    const error = getError(err)

    if (error && error.status === 404) {
      showToast({ severity: 'warn', summary: 'No se encontraron gastos' })
      return
    }

    showToast({ severity: 'error', summary: 'Error', detail: getErrorMessage(err) })
  }
}
</script>
