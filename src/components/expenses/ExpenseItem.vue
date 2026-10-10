<template>
  <div class="flex justify-between">
    <span class="font-medium text-surface-500 dark:text-surface-400 text-sm">
      {{ expense.expensedAt }}
    </span>
    <Button
      type="button"
      icon="pi pi-ellipsis-v"
      @click="$emit('toggle', $event, expense)"
      class="p-button-text p-button-plain w-5!"
      aria-haspopup="true"
      aria-controls="overlay_menu"
    />
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

defineEmits<{ toggle: [event: Event, expense: Expense] }>()
</script>
