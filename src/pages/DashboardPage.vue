<template>
  <AppBreadcrumb :items="[{ label: 'Resumen' }]" />
  <div class="card px-5! pb-5! pt-2!">
    <Fieldset legend="Filtros">
      <div class="grid gap-4 md:flex md:gap-8">
        <FloatLabel variant="on">
          <Select
            v-model="currentGroup"
            inputId="group"
            :options="groups"
            optionLabel="name"
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
      <AmountCard
        title="Gastos"
        variant="orange"
        icon="pi-dollar"
        :total="summary.expenses"
        :amount="summary.amount"
        :firstName="summary.firstName"
      />
      <BudgetCard
        :budget="summary.budget"
        :total="summary.total"
        :percent="summary.percent"
        :group="currentGroup?.name"
      />
      <MembersCard
        v-if="summary.debtors.length"
        title="Te deben"
        variant="cyan"
        icon="pi-money-bill"
        :members="summary.debtors"
      />
      <AmountCard title="Deudas" variant="blue" icon="pi-credit-card" :total="summary.debts" />
      <MembersCard
        v-if="summary.creditors.length"
        title="Le debes"
        variant="purple"
        icon="pi-wallet"
        :members="summary.creditors"
      />
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
import { getErrorMessage } from '@/services/axios'
import { useNotification } from '@/composables/useNotification'
import MembersCard from '@/components/dashboard/MembersCard.vue'
import AmountCard from '@/components/dashboard/AmountCard.vue'
import BudgetCard from '@/components/dashboard/BudgetCard.vue'

const { showToast } = useNotification()

const groups = reactive<Group[]>(await groupsService.getAll())

const today = new Date()

const dateRange = ref<[Date | null, Date | null]>([
  new Date(today.getFullYear(), today.getMonth(), 1),
  today,
])

const summary = ref<ExpenseSummary | undefined>()
const currentGroup = ref<Group | undefined>(groups[0])
const loading = ref(false)

const getSummary = async (params: Partial<QueryParams>): Promise<ExpenseSummary | undefined> => {
  loading.value = true
  try {
    return await expensesService.getSummary(params)
  } catch (err) {
    showToast({ severity: 'error', summary: 'Error', detail: getErrorMessage(err) })
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
      group: newGroup.id,
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
        label: 'Gasto asignado',
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
