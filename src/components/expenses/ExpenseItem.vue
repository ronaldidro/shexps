<template>
  <div class="flex justify-between">
    <div class="flex flex-col">
      <p class="font-medium text-surface-500 dark:text-surface-400 text-sm">
        {{ expense.expensedAt }}
      </p>
      <span class="text-xl font-semibold">S/{{ expense.amount }}</span>
      <span class="font-medium text-surface-500 dark:text-surface-400 text-lg line-clamp-1">
        {{ expense.description }}
      </span>
    </div>
    <div class="flex gap-3">
      <Button icon="pi pi-eye" rounded @click="$emit('show', expense.id)" />
      <Button
        v-if="showDeleteButton"
        icon="pi pi-times"
        severity="danger"
        rounded
        @click="$emit('delete', expense.id)"
      />
    </div>
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
