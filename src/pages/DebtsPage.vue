<template>
  <AppBreadcrumb :items="[{ label: 'Movimientos' }, { label: 'Deudas' }]" />
  <Toolbar class="mb-7">
    <template #start>
      <SearchField v-model="search" @search="handleSearch" />
    </template>
  </Toolbar>
  <div class="card p-1!">
    <div ref="el" class="overflow-y-auto h-dvh">
      <div
        v-for="(detail, index) in details"
        :key="detail.id"
        class="mx-6 py-6"
        :class="{ 'border-t border-surface': index !== 0 }"
      >
        <div class="flex justify-between">
          <div class="flex flex-col">
            <p class="font-medium text-surface-500 dark:text-surface-400 text-sm">
              {{ detail.expense.expensedAt }}
            </p>
            <span class="text-xl font-semibold">S/{{ detail.amount }}</span>
            <span class="font-medium text-surface-500 dark:text-surface-400 text-lg line-clamp-1">
              {{ detail.expense.description }}
            </span>
          </div>
          <div class="flex gap-3">
            <Button icon="pi pi-eye" rounded @click="openDrawer(detail.expense.id)" />
          </div>
        </div>
        <Tag :value="detail.expense.user.firstName" severity="warn" class="mt-2" />
      </div>
      <p v-if="loading" class="text-center pt-5">
        <ProgressSpinner style="width: 50px; height: 50px" />
      </p>
      <p v-else-if="!details.length" class="text-center text-lg pt-5">
        <i class="pi pi-info-circle pr-2" />
        No se encontraron deudas
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
import AppBreadcrumb from '@/layout/AppBreadcrumb.vue'
import { detailsService } from '@/services/details.service'
import type { ExpenseDetail } from '@/types/expense'
import ExpenseDrawer from '@/components/expenses/ExpenseDrawer.vue'
import SearchField from '@/components/SearchField.vue'
import { useScrollPagination } from '@/composables/useScrollPagination'

const el = useTemplateRef('el')

const selectedId = ref<string | null>(null)
const showDrawer = ref(false)
const search = ref('')

const {
  items: details,
  loading,
  setFilters,
} = useScrollPagination<ExpenseDetail>({ el, fetcher: detailsService.getAll })

const handleSearch = async (value: string) => {
  search.value = value
  await setFilters({ search: value })
}

const openDrawer = (id: string) => {
  selectedId.value = id
  showDrawer.value = true
}
</script>
