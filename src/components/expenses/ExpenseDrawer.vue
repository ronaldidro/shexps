<template>
  <Drawer
    v-if="expense"
    :visible="visible"
    @update:visible="close"
    header="Gasto"
    position="bottom"
    style="height: auto"
  >
    <Tag :value="expense.group.name" />
    <div class="flex justify-between items-center py-5">
      <div>
        <span class="font-medium text-xl">
          {{ expense.description }}
        </span>
        <p class="font-medium text-surface-500 dark:text-surface-400">
          {{ expense.expensedAt }}
        </p>
      </div>
      <span class="text-2xl font-semibold">S/{{ expense.amount }}</span>
    </div>
    <Tag severity="warn" value="Detalle" />
    <ul class="pt-5">
      <li v-for="detail in expense.details" :key="detail.id">
        <div vi class="flex justify-between">
          <span class="text-lg">{{ detail.user.firstName }}</span>
          <span class="text-lg font-semibold">S/{{ detail.amount }}</span>
        </div>
      </li>
    </ul>
  </Drawer>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { expensesService } from '@/services/expenses.service'
import type { Expense } from '@/types/expense'

const props = defineProps<{ visible: boolean; id: string | null }>()
const emit = defineEmits<{ (e: 'update:visible', value: boolean): void }>()

const expense = ref<Expense>()

const close = () => emit('update:visible', false)

watch(
  () => props.visible,
  async (isVisible) => {
    if (!isVisible || !props.id) return
    expense.value = await expensesService.get(props.id)
  },
)
</script>
