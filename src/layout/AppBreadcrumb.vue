<template>
  <div class="mb-7 rounded-md">
    <Breadcrumb
      :home="{ icon: 'pi pi-home', to: '/' }"
      :model="items"
      class="p-0! bg-transparent!"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{ items: { label: string }[] }>();
</script>
