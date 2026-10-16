<template>
  <div class="flex items-center justify-between">
    <span class="block text-muted-color font-medium text-xl">{{ title }}</span>
    <div
      class="flex items-center justify-center rounded-border"
      :class="classes.bg"
      style="width: 2.5rem; height: 2.5rem"
    >
      <i class="pi text-xl!" :class="[icon, classes.text]"></i>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

export type HeaderVariant = 'orange' | 'teal' | 'cyan' | 'blue' | 'purple'

const props = defineProps<{
  title: string
  variant: HeaderVariant
  icon: string
}>()

const styles = {
  orange: {
    bg: 'bg-orange-100 dark:bg-orange-400/10',
    text: 'text-orange-500',
  },
  teal: {
    bg: 'bg-teal-100 dark:bg-teal-400/10',
    text: 'text-teal-500',
  },
  cyan: {
    bg: 'bg-cyan-100 dark:bg-cyan-400/10',
    text: 'text-cyan-500',
  },
  blue: {
    bg: 'bg-blue-100 dark:bg-blue-400/10',
    text: 'text-blue-500',
  },
  purple: {
    bg: 'bg-purple-100 dark:bg-purple-400/10',
    text: 'text-purple-500',
  },
}

const classes = ref(styles[props.variant])
</script>
