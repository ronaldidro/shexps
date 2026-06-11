<template>
  <InputGroup class="max-w-60 md:max-w-full">
    <IconField>
      <InputText v-model="search" placeholder="Buscar por descripción" />
      <InputIcon v-if="search" class="pi pi-times cursor-pointer" @click="$emit('search', '')" />
    </IconField>
    <Button icon="pi pi-search" @click="$emit('search', search)" />
  </InputGroup>
</template>

<script setup lang="ts">
const search = defineModel<string>({ default: '' })
defineEmits<{ (e: 'search', value: string): void }>()
</script>
