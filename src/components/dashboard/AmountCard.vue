<template>
  <div class="card mb-0! flex flex-col gap-4">
    <CardHeader :title :variant :icon />
    <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">
      S/{{ total }} en total
    </div>
    <div v-if="amount" class="flex items-center justify-between">
      <span class="font-medium">{{ firstName }}</span>
      <Chip :label="`S/${amount}`" />
    </div>
  </div>
</template>

<script setup lang="ts">
import CardHeader, { type HeaderVariant } from '@/components/dashboard/CardHeader.vue'

defineProps<{
  title: string
  variant: HeaderVariant
  icon: string
  total: number
  amount?: number
  firstName?: string
}>()
</script>
