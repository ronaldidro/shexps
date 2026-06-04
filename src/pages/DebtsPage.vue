<template>
  <AppBreadcrumb :items="[{ label: 'Movimientos' }, { label: 'Deudas' }]" />
  <Toolbar class="mb-7">
    <template #start>
      <InputGroup>
        <Button icon="pi pi-search" @click="handleSearch" />
        <InputText v-model="search" placeholder="Buscar" />
      </InputGroup>
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
            <p
              class="font-medium text-surface-500 dark:text-surface-400 text-sm"
            >
              {{ detail.expense.expensedAt }}
            </p>
            <span class="text-xl font-semibold">S/{{ detail.amount }}</span>
            <span
              class="font-medium text-surface-500 dark:text-surface-400 text-lg line-clamp-1"
            >
              {{ detail.expense.description }}
            </span>
          </div>
          <div class="flex gap-3">
            <Button
              icon="pi pi-eye"
              rounded
              @click="openDrawer(detail.expense.id)"
            />
          </div>
        </div>
        <Tag
          :value="detail.expense.user.firstName"
          severity="warn"
          class="mt-2"
        />
      </div>
      <p v-show="loading" class="text-center py-4">
        <i class="pi pi-spin pi-spinner" />
        Cargando...
      </p>
    </div>
  </div>
  <ExpenseDrawer v-model:visible="showDrawer" :id="selectedId" />
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from "vue";
import AppBreadcrumb from "@/layout/AppBreadcrumb.vue";
import { expensesService } from "@/services/expenses.service";
import type { ExpenseDetail } from "@/types/expense";
import ExpenseDrawer from "@/components/expenses/ExpenseDrawer.vue";
import { useScrollPagination } from "@/composables/useScrollPagination";

const el = useTemplateRef("el");

const selectedId = ref<string | null>(null);
const showDrawer = ref(false);
const search = ref("");

const {
  items: details,
  loading,
  setFilters,
} = await useScrollPagination<ExpenseDetail>({
  el,
  fetcher: expensesService.getDetails,
});

const handleSearch = async () => await setFilters({ search: search.value });

const openDrawer = (id: string) => {
  selectedId.value = id;
  showDrawer.value = true;
};
</script>
