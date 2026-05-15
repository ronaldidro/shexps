<template>
  <div class="breadcrumb-card">
    <Breadcrumb
      :home="{ icon: 'pi pi-home', to: '/' }"
      :model="items"
      class="p-0! px"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{ items: { label: string }[] }>();
</script>

<style scoped>
.breadcrumb-card {
  background: var(--surface-card);
  padding-inline: 2rem;
  padding-block: 1rem;
  margin-bottom: 2rem;
  border-radius: var(--content-border-radius);

  &:last-child {
    margin-bottom: 0;
  }
}
</style>
