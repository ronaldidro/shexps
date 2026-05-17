<template>
  <Dialog
    :visible="visible"
    @update:visible="close"
    :style="{ width: '300px' }"
    header="Nuevo grupo"
    :modal="true"
  >
    <GroupForm @submit="submit" />
  </Dialog>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from "@primevue/forms";
import GroupForm from "./GroupForm.vue";

defineProps<{ visible: boolean }>();

const emit = defineEmits<{
  (e: "update:visible", value: boolean): void;
  (e: "onSubmit", form: FormSubmitEvent): void;
}>();

const submit = (form: FormSubmitEvent) => {
  if (form.valid) {
    emit("onSubmit", form);
    emit("update:visible", false);
  }
};

const close = () => {
  emit("update:visible", false);
};
</script>
