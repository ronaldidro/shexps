<template>
  <AppBreadcrumb :items="[{ label: 'Gastos' }]" />
  <Toolbar class="mb-5">
    <template #start>
      <SearchField v-model="search" @search="handleSearch" />
    </template>
    <template #end>
      <SplitButton
        label="Nuevo"
        @click="router.push({ name: 'new-expense' })"
        :model="[
          { label: 'Procesar imagen', icon: 'pi pi-image', command: () => (show.dialog = true) },
        ]"
      />
    </template>
  </Toolbar>
  <FilterPanel
    @submit="handleFilters"
    @clear="handleClear"
    @delete="openDeleteFilterDialog"
    @report="handleReport"
    :total="data?.meta?.total"
    :showReportButton="true"
    :reporting
    :showAuthUser="true"
    :showDeleteOption="true"
  />
  <p v-if="isLoading" class="text-center pt-5">
    <ProgressSpinner style="width: 50px; height: 50px" />
  </p>
  <p v-else-if="!data?.items.length" class="text-center text-lg pt-5">
    <i class="pi pi-info-circle pr-2" />
    No se encontraron gastos
  </p>
  <div v-else class="card p-1!">
    <div
      v-for="(expense, index) in data?.items"
      :key="expense.id"
      class="mx-6 py-6"
      :class="{ 'border-t border-surface': index !== 0 }"
    >
      <ExpenseItem :expense="expense" @toggle="toggleMenu" />
    </div>
  </div>
  <ScrollTop
    icon="pi pi-arrow-up"
    :buttonProps="{ severity: 'contrast', raised: true, rounded: true, class: 'mb-20 md:mb-0' }"
  />
  <div ref="sentinel"></div>
  <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
  <ExpenseDrawer v-model:visible="show.drawer" :expense />
  <ExpenseFileDialog
    v-model:visible="show.dialog"
    @upload="handleUpload"
    @error="handleUploadError"
  />
</template>

<script setup lang="ts">
import { computed, nextTick, reactive, ref, watch } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
import { useRoute } from 'vue-router'
import { useConfirm } from 'primevue'
import type { Expense } from '@/types/expense'
import type { QueryParams } from '@/types/pagination'
import AppBreadcrumb from '@/layout/AppBreadcrumb.vue'
import { expensesService } from '@/services/expenses.service'
import { getErrorMessage } from '@/services/axios'
import ExpenseFileDialog from '@/components/expenses/ExpenseFileDialog.vue'
import ExpenseDrawer from '@/components/expenses/ExpenseDrawer.vue'
import ExpenseItem from '@/components/expenses/ExpenseItem.vue'
import SearchField from '@/components/SearchField.vue'
import FilterPanel from '@/components/FilterPanel.vue'
import { useExpenseQuery } from '@/composables/query/useExpenseQuery'
import { useNotification } from '@/composables/useNotification'
import { useReport } from '@/composables/useReport'
import { useAuthStore } from '@/stores/auth.store'
import router from '@/router'

const route = useRoute()
const confirm = useConfirm()
const { user } = useAuthStore()
const { showToast } = useNotification()
const { handleReport, reporting } = useReport(expensesService.getReport)
const { findAll, findOne, remove, removeAll } = useExpenseQuery()

const sentinel = ref(null)
const expense = ref<Expense | null>(null)
const show = reactive({ drawer: false, dialog: false })
const search = ref('')
const menu = ref()
const filters = ref<Partial<QueryParams>>({})

const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = findAll(filters)
const { mutate: findExpense } = findOne()
const { mutate: removeExpense } = remove()
const { mutate: removeExpenses } = removeAll()

useIntersectionObserver(sentinel, ([entry]) => {
  if (entry?.isIntersecting && hasNextPage.value && !isFetchingNextPage.value) fetchNextPage()
})

const items = computed(() => {
  const selected = expense.value

  if (!selected) return []

  return [
    {
      label: 'Ver',
      icon: 'pi pi-fw pi-eye',
      command: () => router.replace({ name: 'expenses', params: { id: selected.id } }),
    },
    {
      label: 'Eliminar',
      icon: 'pi pi-fw pi-times',
      visible: selected.user.id === user.id,
      command: () => openDeleteDialog(selected.id),
    },
  ]
})

const toggleMenu = (event: Event, selected: Expense) => {
  expense.value = selected
  menu.value.toggle(event)
}

const openDrawer = (id: string) =>
  findExpense(id, {
    onSuccess: (data) => {
      expense.value = data
      show.drawer = true
    },
    onError: (err) => {
      router.replace({ name: 'expenses' })
      showToast({ severity: 'error', summary: 'Error', detail: getErrorMessage(err) })
    },
  })

const handleSearch = (value: string) => {
  search.value = value
  filters.value = { search: search.value }
}

const handleFilters = (values: QueryParams) => (filters.value = values)

const handleClear = () => (filters.value = {})

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

const handleDelete = (id: string) =>
  removeExpense(id, {
    onSuccess: () => {
      showToast({ severity: 'success', summary: 'Gasto eliminado correctamente' })
      handleClear()
    },
  })

const handleDeleteFilter = (values: QueryParams) =>
  removeExpenses(
    { payload: values },
    {
      onSuccess: () => {
        showToast({ severity: 'success', summary: 'Gastos eliminados correctamente' })
        handleClear()
      },
    },
  )

const handleUpload = (response: { description: string; amount: number }) =>
  router.push({ name: 'new-expense', query: response })

const handleUploadError = (response: { statusCode: number; message: string }) =>
  showToast({ severity: 'error', summary: 'Error', detail: response.message })

watch(
  () => route.params.id,
  async (id) => {
    if (!id) return
    await nextTick()
    openDrawer(id as string)
  },
  { immediate: true },
)

watch(show, (isVisible) => {
  if (!isVisible.drawer && route.params.id) {
    expense.value = null
    router.replace({ name: 'expenses' })
  }
})
</script>
