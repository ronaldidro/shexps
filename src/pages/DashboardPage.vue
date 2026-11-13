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
            :loading="isGroupsLoading"
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
  <div v-if="isFetching || isGroupsLoading" class="text-center pt-5">
    <ProgressSpinner style="width: 50px; height: 50px" />
  </div>
  <div v-else-if="summary">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <AmountCard
        title="Gastos"
        variant="orange"
        icon="pi-dollar"
        :total="summary.expenses"
        :amount="summary.amount"
        :firstName="summary.firstName"
      />
      <BudgetCard :budget="summary.budget" :total="summary.total" :percent="summary.percent" />
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
    <ScrollTop
      icon="pi pi-arrow-up"
      :buttonProps="{ severity: 'contrast', raised: true, rounded: true, class: 'mb-20 md:mb-0' }"
    />
  </div>
  <p v-else class="text-center text-lg pt-5">
    <i class="pi pi-info-circle pr-2" />
    No se encontraron resultados
  </p>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import type { ChartData, ChartOptions } from 'chart.js'
import type { Group } from '@/types/group'
import AppBreadcrumb from '@/layout/AppBreadcrumb.vue'
import { useExpenseQuery } from '@/composables/query/useExpenseQuery'
import { useGroupQuery } from '@/composables/query/useGroupQuery'
import MembersCard from '@/components/dashboard/MembersCard.vue'
import AmountCard from '@/components/dashboard/AmountCard.vue'
import BudgetCard from '@/components/dashboard/BudgetCard.vue'

const { findSummary } = useExpenseQuery()
const { findAll: findGroups } = useGroupQuery()

const { data: groups, isLoading: isGroupsLoading } = findGroups()

const today = new Date()

const dateRange = ref<[Date | null, Date | null]>([
  new Date(today.getFullYear(), today.getMonth(), 1),
  today,
])

const currentGroup = ref<Group | undefined>(groups.value?.[0])

watch(
  groups,
  (newGroups) => {
    if (newGroups?.length && !currentGroup.value) currentGroup.value = newGroups[0]
  },
  { immediate: true },
)

const { data: summary, isFetching } = findSummary(() => {
  const group = currentGroup.value
  const [from, to] = dateRange.value

  return {
    group: group?.id,
    startDate: from?.toISOString().split('T')[0],
    endDate: to?.toISOString().split('T')[0],
  }
})

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
        filter: (item) => (item.raw as number) > 0,
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

  const { labels, debtsData, expensesData } = summary.value.chart

  return {
    labels: [...labels],
    datasets: [
      {
        type: 'bar',
        label: 'Asignado',
        backgroundColor: documentStyle.getPropertyValue('--p-cyan-500'),
        data: [...debtsData],
        grouped: false,
      },
      {
        type: 'bar',
        label: 'Total',
        backgroundColor: documentStyle.getPropertyValue('--p-gray-500'),
        data: [...expensesData],
      },
    ],
  }
})

const chartOptions = reactive(setChartOptions())
</script>
