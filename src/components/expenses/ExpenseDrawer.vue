<template>
  <Drawer
    v-if="expense"
    :visible="visible"
    @update:visible="close"
    header="Detalle"
    position="bottom"
    style="height: auto"
  >
    <div class="flex justify-between">
      <Tag severity="info" value="Gasto" />
      <Tag :value="expense.group.name" />
    </div>
    <div class="flex justify-between items-center pt-5">
      <div>
        <span class="font-medium text-xl">
          {{ expense.description }}
        </span>
        <p class="font-medium text-surface-500 dark:text-surface-400 text-sm">
          {{ expense.expensedAt }}
        </p>
      </div>
      <span class="text-2xl font-semibold">S/{{ expense.amount }}</span>
    </div>
    <hr />
    <Tag severity="warn" value="Deudores" />
    <ul class="pt-5">
      <li
        v-for="detail in expense.details"
        :key="detail.id"
        class="flex justify-between"
      >
        <span class="text-lg">{{ detail.user.fullName }}</span>
        <span class="text-lg font-semibold">S/{{ detail.amount }}</span>
      </li>
    </ul>
  </Drawer>
</template>

<script setup lang="ts">
import { expensesService } from "@/services/expenses.service";
import type { Expense } from "@/types/expense";
import { ref, watch } from "vue";

const props = defineProps<{
  visible: boolean;
  id: string | null;
}>();

const emit = defineEmits<{
  (e: "update:visible", value: boolean): void;
}>();

const close = () => emit("update:visible", false);

const expense = ref<Expense>();

watch(
  () => props.visible,
  async (isVisible) => {
    if (!isVisible || !props.id) return;
    expense.value = await expensesService.get(props.id);
  },
);
</script>
