<script setup>
import { useConfig } from '@/composables/useConfig'

const { appName } = useConfig()
</script>

<template>
  <div class="layout-footer">
    {{ appName }} by
    <a
      href="https://ronaldidro.github.io/developerFolio"
      target="_blank"
      rel="noopener noreferrer"
      class="text-primary font-bold hover:underline"
    >
      ronaldidro
    </a>
  </div>
</template>
