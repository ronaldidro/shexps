<template>
  <div class="card mb-0! flex flex-col gap-4">
    <CardHeader :title :variant :icon />
    <div v-for="(member, index) in members" :key="index" class="flex items-center justify-between">
      <span class="font-medium">{{ member.firstName }}</span>
      <Chip :label="`S/${member.amount}`" />
    </div>
  </div>
</template>

<script setup lang="ts">
import CardHeader, { type HeaderVariant } from '@/components/dashboard/CardHeader.vue'

defineProps<{
  title: string
  variant: HeaderVariant
  icon: string
  members: { firstName: string; amount: number }[]
}>()
</script>
