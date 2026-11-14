<template>
  <Toast />
  <ConfirmDialog />
  <DynamicDialog />
  <RouterView />
  <VueQueryDevtools buttonPosition="bottom-left" position="right" />
</template>

<script setup>
import { VueQueryDevtools } from '@tanstack/vue-query-devtools'
</script>
