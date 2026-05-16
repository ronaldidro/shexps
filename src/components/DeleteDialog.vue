<template>
  <Dialog
    :visible="visible"
    :header="header"
    :style="{ width: '350px' }"
    :modal="true"
  >
    <div class="flex items-center justify-center">
      <i class="pi pi-exclamation-triangle mr-4" style="font-size: 2rem" />
      <span>{{ message }}</span>
    </div>
    <template #footer>
      <Button
        label="No"
        icon="pi pi-times"
        text
        severity="secondary"
        @click="close"
      />
      <Button
        label="Sí, continuar"
        icon="pi pi-check"
        severity="danger"
        outlined
        autofocus
        @click="confirm"
      />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
defineProps<{
  visible: boolean;
  header: string;
  message: string;
}>();

const emit = defineEmits<{
  (e: "update:visible", value: boolean): void;
  (e: "confirm"): void;
}>();

const close = () => {
  emit("update:visible", false);
};

const confirm = () => {
  emit("confirm");
  emit("update:visible", false);
};
</script>
