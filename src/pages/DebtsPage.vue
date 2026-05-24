<template>
  <AppBreadcrumb :items="[{ label: 'Movimientos' }, { label: 'Deudas' }]" />
  <Toolbar class="mb-7">
    <template #start>
      <IconField>
        <InputIcon>
          <i class="pi pi-search" />
        </InputIcon>
        <InputText placeholder="Buscar por descripción" />
      </IconField>
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
          :value="detail.expense.user.fullName"
          severity="info"
          class="mt-2"
        />
      </div>
      <p v-show="loading" class="text-center py-4">
        <i class="pi pi-spin pi-spinner" />
        Cargando...
      </p>
      <p v-show="!hasMore" class="text-center py-4">No hay más registros</p>
    </div>
  </div>
  <ExpenseDrawer v-model:visible="showDrawer" :id="selectedId" />
</template>

<script setup lang="ts">
import { ref, onMounted, useTemplateRef } from "vue";
import { useInfiniteScroll } from "@vueuse/core";
import AppBreadcrumb from "@/layout/AppBreadcrumb.vue";
import { expensesService } from "@/services/expenses.service";
import type { ExpenseDetail } from "@/types/expense";
import ExpenseDrawer from "@/components/expenses/ExpenseDrawer.vue";

const el = useTemplateRef("el");

const details = ref<ExpenseDetail[]>([]);

const page = ref(1);
const loading = ref(false);
const hasMore = ref(true);

const selectedId = ref<string | null>(null);
const showDrawer = ref(false);

const openDrawer = (id: string) => {
  selectedId.value = id;
  showDrawer.value = true;
};

const loadPage = async () => {
  if (loading.value || !hasMore.value) return;

  loading.value = true;

  try {
    const response = await expensesService.getDetails({
      page: page.value,
      limit: 5,
    });

    details.value.push(...response.data);

    hasMore.value = response.meta.page < response.meta.lastPage;

    page.value++;
  } finally {
    loading.value = false;
  }
};

onMounted(loadPage);

useInfiniteScroll(el, loadPage, {
  distance: 10,
  canLoadMore: () => hasMore.value && !loading.value,
});
</script>
