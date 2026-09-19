<template>
  <div class="flex justify-between">
    <span class="font-medium text-surface-500 dark:text-surface-400 text-sm">
      {{ expense.expensedAt }}
    </span>
    <div class="flex gap-2">
      <Button
        icon="pi pi-eye"
        size="small"
        raised
        text
        rounded
        @click="$emit('show', expense.id)"
      />
      <Button
        v-if="showDeleteButton"
        icon="pi pi-times"
        severity="danger"
        size="small"
        raised
        text
        rounded
        @click="$emit('delete', expense.id)"
      />
    </div>
  </div>
  <div>
    <span class="text-xl font-semibold">S/{{ expense.amount }}</span>
    <span class="font-medium text-surface-500 dark:text-surface-400 text-lg line-clamp-1">
      {{ expense.description }}
    </span>
  </div>
  <div class="flex justify-between mt-2">
    <Tag :value="expense.user.firstName" severity="info" />
    <Tag :value="expense.group.name" severity="secondary" />
  </div>
</template>

<script setup lang="ts">
import type { Expense } from '@/types/expense'

defineProps<{ expense: Expense; showDeleteButton: boolean }>()

defineEmits<{
  (e: 'show', value: string): void
  (e: 'delete', value: string): void
}>()
</script>
