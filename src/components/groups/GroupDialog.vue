<template>
  <Dialog
    :visible="visible"
    @update:visible="close"
    :style="{ width: '300px' }"
    header="Nuevo grupo"
    :modal="true"
  >
    <GroupForm
      @submit="submit"
      leftButtonLabel="Cancelar"
      @click:leftButton="close"
    />
  </Dialog>
</template>

<script setup lang="ts">
import type { GroupPayload } from "@/types/group.ts";
import GroupForm from "./GroupForm.vue";

defineProps<{ visible: boolean }>();

const emit = defineEmits<{
  (e: "update:visible", value: boolean): void;
  (e: "onSubmit", values: GroupPayload): void;
}>();

const submit = (values: GroupPayload) => {
  emit("onSubmit", values);
  emit("update:visible", false);
};

const close = () => emit("update:visible", false);
</script>
