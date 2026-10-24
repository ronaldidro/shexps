<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', false)"
    :style="{ width: '350px' }"
    :header
    :modal="true"
  >
    <UserForm
      mode="manage"
      :loading
      :initialValues
      @submit="submit"
      @cancel="$emit('update:visible', false)"
    />
  </Dialog>
</template>

<script setup lang="ts">
import type { UserPayload } from '@/types/user'
import UserForm from '@/components/users/UserForm.vue'

defineProps<{ header: string; visible: boolean; initialValues: UserPayload; loading: boolean }>()

const emit = defineEmits<{ 'update:visible': [value: boolean]; submit: [values: UserPayload] }>()

const submit = (values: UserPayload) => emit('submit', values)
</script>
