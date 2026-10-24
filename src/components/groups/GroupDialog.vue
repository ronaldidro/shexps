<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', false)"
    :style="{ width: '300px' }"
    header="Nuevo grupo"
    :modal="true"
  >
    <GroupForm
      @submit="submit"
      leftButtonLabel="Cancelar"
      @click:leftButton="$emit('update:visible', false)"
      :loading
    />
  </Dialog>
</template>

<script setup lang="ts">
import type { GroupPayload } from '@/types/group.ts'
import GroupForm from './GroupForm.vue'

defineProps<{ visible: boolean; loading: boolean }>()

const emit = defineEmits<{ 'update:visible': [value: boolean]; submit: [values: GroupPayload] }>()

const submit = (values: GroupPayload) => emit('submit', values)
</script>
