<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', false)"
    :style="{ width: '350px' }"
    header="Procesar imagen con IA"
    :modal="true"
  >
    <div class="card p-1! flex flex-col gap-4">
      <Message icon="pi pi-fw pi-info-circle">
        Elige una imagen donde se visualice el gasto con letra clara y legible.
      </Message>
      <FileUpload
        name="file"
        :url="`${API_URL}/expenses/upload`"
        @before-send="onBeforeSend"
        @upload="onUpload"
        @error="onError"
        accept="image/*"
        :maxFileSize="5 * 1024 * 1024"
        chooseLabel="Agregar"
        :uploadButtonProps="{ severity: 'info' }"
      >
        <template #empty>
          <span>No hay imagen seleccionada.</span>
        </template>
      </FileUpload>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import type {
  FileUploadBeforeSendEvent,
  FileUploadErrorEvent,
  FileUploadUploadEvent,
} from 'primevue'
import { API_URL } from '@/utils'
import { useAuthStore } from '@/stores/auth.store'

defineProps<{ visible: boolean }>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
  upload: [{ description: string; amount: number }]
  error: [{ statusCode: number; message: string }]
}>()

const { user } = useAuthStore()

const onBeforeSend = (e: FileUploadBeforeSendEvent) =>
  e.xhr.setRequestHeader('Authorization', `Bearer ${user.token}`)

const onUpload = (e: FileUploadUploadEvent) => {
  emit('upload', JSON.parse(e.xhr.response))
  emit('update:visible', false)
}

const onError = (e: FileUploadErrorEvent) => {
  emit('error', JSON.parse(e.xhr.response))
  emit('update:visible', false)
}
</script>
