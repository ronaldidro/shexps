<template>
  <div class="flex flex-col gap-4">
    <ExpensePreview v-if="preview.type === 'expense'" :expense="preview" />
    <PaymentPreview v-if="preview.type === 'payment'" :payment="preview" />
    <span class="text-right font-semibold text-lg mt-5"> ¿Está seguro que desea continuar? </span>
    <div class="flex justify-end gap-2">
      <Button label="No" severity="secondary" outlined @click="close" />
      <Button label="Si, guardar" icon="pi pi-check" @click="confirm" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import type { DynamicDialogInstance } from 'primevue/dynamicdialogoptions'
import ExpensePreview from './ExpensePreview.vue'
import PaymentPreview from './PaymentPreview.vue'

const emit = defineEmits<{ (e: 'save'): void }>()

const dialogRef = inject<{ value: DynamicDialogInstance }>('dialogRef')

const preview = computed(() => dialogRef?.value.data)

const close = () => dialogRef?.value.close()

const confirm = () => {
  emit('save')
  close()
}
</script>
