<template>
  <Panel header="Filtros" toggleable collapsed class="mb-5">
    <Form
      ref="formRef"
      v-slot="$form"
      :resolver="filterResolver"
      @submit="onSubmit"
    >
      <div class="flex flex-col md:flex-row gap-4 pb-4">
        <div class="flex flex-col flex-1 gap-2">
          <label for="group">Grupo</label>
          <Select
            id="group"
            name="group"
            :options="groups"
            optionLabel="name"
            optionValue="id"
            placeholder="Selecciona grupo"
            fluid
          />
        </div>
        <div class="flex flex-col flex-1 gap-2">
          <label for="user">Miembro</label>
          <Select
            id="user"
            name="user"
            :options="members"
            optionLabel="firstName"
            optionValue="id"
            placeholder="Selecciona miembro"
            fluid
          />
        </div>
        <div class="flex flex-col flex-1 gap-2">
          <label for="range">Rango de fechas</label>
          <DatePicker
            id="range"
            name="range"
            dateFormat="dd/mm/yy"
            selectionMode="range"
            :maxDate="new Date()"
            :manualInput="false"
            hideOnRangeSelection
            showIcon
            showButtonBar
            placeholder="Selecciona fechas"
            fluid
          />
          <Message
            v-if="$form.range?.invalid"
            severity="error"
            variant="simple"
          >
            {{ $form.range.error?.message }}
          </Message>
        </div>
      </div>
      <div class="flex justify-between md:justify-end gap-2">
        <Button
          type="button"
          label="Limpiar"
          severity="danger"
          icon="pi pi-eraser"
          @click="onClear"
        />
        <Button
          type="button"
          label="Reporte"
          severity="contrast"
          icon="pi pi-file-pdf"
        />
        <Button type="submit" label="Filtrar" icon="pi pi-filter" />
      </div>
    </Form>
  </Panel>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import type { Group } from "@/types/group";
import type { FormInstance, FormSubmitEvent } from "@primevue/forms";
import { groupsService } from "@/services/groups.service";
import { useGroupMembers } from "@/composables/useGroupMembers";
import { filterResolver } from "@/resolvers/filter.resolver";
import type { QueryParams } from "@/types/pagination";

const emit = defineEmits<{
  (e: "submit", payload: QueryParams): void;
  (e: "clear"): void;
}>();

const formRef = ref<FormInstance | null>(null);
const groups = reactive<Group[]>(await groupsService.getAll());

const members = useGroupMembers(() => formRef.value?.states.group?.value);

const onSubmit = (form: FormSubmitEvent) => {
  if (!form.valid) return;
  emit("submit", form.values as QueryParams);
};

const onClear = () => {
  formRef.value?.reset();
  members.value = [];
  emit("clear");
};
</script>
