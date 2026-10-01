<template>
  <AppBreadcrumb :items="[{ label: 'Resumen' }]" />
  <div class="card px-5! pb-5! pt-2!">
    <Fieldset legend="Filtros" :toggleable="true">
      <div class="grid gap-4 md:flex md:gap-8">
        <FloatLabel variant="on">
          <Select
            v-model="currentGroup"
            inputId="group"
            :options="groups"
            optionLabel="name"
            optionValue="id"
            :defaultValue="currentGroup"
            fluid
          />
          <label for="group">Grupo</label>
        </FloatLabel>
        <FloatLabel variant="on">
          <DatePicker
            v-model="dateRange"
            inputId="range"
            dateFormat="dd/mm/yy"
            selectionMode="range"
            :maxDate="today"
            :manualInput="false"
            hideOnRangeSelection
            showIcon
            showButtonBar
            fluid
          />
          <label for="range">Rango de fechas</label>
        </FloatLabel>
      </div>
    </Fieldset>
  </div>
  <div v-if="loading" class="text-center pt-5">
    <ProgressSpinner style="width: 50px; height: 50px" />
  </div>
  <div v-else-if="summary?.creditors.length || summary?.debtors.length">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div class="card mb-0! flex flex-col gap-4">
        <div class="flex items-center justify-between">
          <span class="block text-muted-color font-medium text-xl">Gastos</span>
          <div
            class="flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-border"
            style="width: 2.5rem; height: 2.5rem"
          >
            <i class="pi pi-dollar text-orange-500 text-xl!"></i>
          </div>
        </div>
        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">
          S/{{ summary.expenses }} en total
        </div>
        <div v-if="summary.amount" class="flex items-center justify-between">
          <span class="font-medium">{{ summary.user }}</span>
          <Chip :label="`S/${summary.amount}`" />
        </div>
        <div class="flex justify-between">
          <Button asChild v-slot="slotProps" text raised>
            <RouterLink :class="slotProps.class" :to="{ name: 'new-expense' }">
              <i class="pi pi-plus" /> Nuevo
            </RouterLink>
          </Button>
          <Button asChild v-slot="slotProps" text raised>
            <RouterLink :class="slotProps.class" :to="{ name: 'expenses' }">
              <i class="pi pi-eye" /> Ver
            </RouterLink>
          </Button>
        </div>
      </div>
      <div v-if="summary.debtors.length" class="card mb-0! flex flex-col gap-4">
        <div class="flex items-center justify-between">
          <span class="block text-muted-color font-medium text-xl">Te deben</span>
          <div
            class="flex items-center justify-center bg-cyan-100 dark:bg-cyan-400/10 rounded-border"
            style="width: 2.5rem; height: 2.5rem"
          >
            <i class="pi pi-money-bill text-cyan-500 text-xl!"></i>
          </div>
        </div>
        <div
          v-for="(debtor, index) in summary.debtors"
          :key="index"
          class="flex items-center justify-between"
        >
          <span class="font-medium">{{ debtor.firstName }}</span>
          <Chip :label="`S/${debtor.amount}`" />
        </div>
      </div>
      <div class="card mb-0! flex flex-col gap-4">
        <div class="flex items-center justify-between">
          <span class="block text-muted-color font-medium text-xl">Deudas</span>
          <div
            class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-border"
            style="width: 2.5rem; height: 2.5rem"
          >
            <i class="pi pi-credit-card text-blue-500 text-xl!"></i>
          </div>
        </div>
        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">
          S/{{ summary.debts }} en total
        </div>
      </div>
      <div v-if="summary.creditors.length" class="card mb-0! flex flex-col gap-4">
        <div class="flex items-center justify-between">
          <span class="block text-muted-color font-medium text-xl">Le debes</span>
          <div
            class="flex items-center justify-center bg-purple-100 dark:bg-purple-400/10 rounded-border"
            style="width: 2.5rem; height: 2.5rem"
          >
            <i class="pi pi-wallet text-purple-500 text-xl!"></i>
          </div>
        </div>
        <div
          v-for="(creditor, index) in summary.creditors"
          :key="index"
          class="flex items-center justify-between"
        >
          <span class="font-medium">{{ creditor.firstName }}</span>
          <Chip :label="`S/${creditor.amount}`" />
        </div>
      </div>
    </div>
    <div class="card mt-8">
      <Chart type="bar" :data="chartData" :options="chartOptions" class="h-120" />
    </div>
  </div>
  <p v-else class="text-center text-lg pt-5">
    <i class="pi pi-info-circle pr-2" />
    No se encontraron resultados
  </p>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import type { ChartData, ChartOptions } from 'chart.js'
import type { ExpenseSummary } from '@/types/expense'
import type { Group } from '@/types/group'
import type { QueryParams } from '@/types/pagination'
import AppBreadcrumb from '@/layout/AppBreadcrumb.vue'
import { expensesService } from '@/services/expenses.service'
import { groupsService } from '@/services/groups.service'

const groups = reactive<Group[]>(await groupsService.getAll())

const today = new Date()

const dateRange = ref<[Date | null, Date | null]>([
  new Date(today.getFullYear(), today.getMonth(), 1),
  today,
])

const summary = ref<ExpenseSummary | undefined>()
const currentGroup = ref<string | undefined>(groups[0]?.id)
const loading = ref(false)

const getSummary = async (params: Partial<QueryParams>): Promise<ExpenseSummary | undefined> => {
  loading.value = true
  try {
    return await expensesService.getSummary(params)
  } catch (error) {
    console.log('error', error)
    return
  } finally {
    loading.value = false
  }
}

watch(
  [currentGroup, dateRange],
  async ([newGroup, newRange]) => {
    if (!newGroup || !newRange) return

    const [from, to] = newRange

    if (!from || !to) return

    summary.value = await getSummary({
      group: newGroup,
      startDate: from.toISOString(),
      endDate: to.toISOString(),
    })
  },
  { immediate: true },
)

const setChartOptions = (): ChartOptions<'bar'> => {
  const documentStyle = getComputedStyle(document.documentElement)
  const textColor = documentStyle.getPropertyValue('--p-text-color')
  const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color')
  const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color')

  return {
    maintainAspectRatio: false,
    aspectRatio: 0.8,
    plugins: {
      tooltip: {
        mode: 'index',
        intersect: false,
        itemSort: (a, b) => b.datasetIndex - a.datasetIndex,
      },
      legend: { labels: { color: textColor } },
    },
    scales: {
      x: { ticks: { color: textColorSecondary }, grid: { color: surfaceBorder } },
      y: { ticks: { color: textColorSecondary }, grid: { color: surfaceBorder } },
    },
  }
}

const chartData = computed<ChartData<'bar'>>(() => {
  const documentStyle = getComputedStyle(document.documentElement)

  if (!summary.value) return { labels: [], datasets: [] }

  return {
    labels: summary.value.chart.labels,
    datasets: [
      {
        type: 'bar',
        label: 'Gasto individual',
        backgroundColor: documentStyle.getPropertyValue('--p-cyan-500'),
        data: summary.value.chart.debtsData,
        grouped: false,
      },
      {
        type: 'bar',
        label: 'Gasto total',
        backgroundColor: documentStyle.getPropertyValue('--p-gray-500'),
        data: summary.value.chart.expensesData,
      },
    ],
  }
})

const chartOptions = reactive(setChartOptions())
</script>
