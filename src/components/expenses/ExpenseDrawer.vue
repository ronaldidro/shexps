<template>
  <Drawer
    v-if="expense"
    :visible="visible"
    @update:visible="$emit('update:visible', false)"
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
    <Tag severity="warn" value="Miembros" />
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
import type { Expense } from '@/types/expense'

defineProps<{ visible: boolean; expense: Expense | null }>()

defineEmits<{ (e: 'update:visible', value: boolean): void }>()
</script>
