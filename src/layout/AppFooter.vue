<script setup>
import { reactive } from 'vue'
import { APP_NAME } from '@/utils'

const appName = reactive(APP_NAME)
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
