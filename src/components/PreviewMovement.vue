<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center justify-between">
      <article class="flex items-center gap-2">
        <i class="pi pi-address-book" />
        <span class="text-lg">Grupo</span>
      </article>
      <span class="text-muted-color font-medium">{{ preview.group }}</span>
    </div>
    <div class="flex items-center justify-between">
      <article class="flex items-center gap-2">
        <i class="pi pi-calendar" />
        <span class="text-lg">Fecha</span>
      </article>
      <span class="text-muted-color font-medium">
        {{ new Date(preview.expensedAt).toLocaleDateString() }}
      </span>
    </div>
    <article class="flex items-center gap-2">
      <i class="pi pi-list-check" />
      <span class="text-lg">Descripción</span>
    </article>
    <span class="text-muted-color font-medium">{{ preview.description }}</span>
    <article class="flex items-center gap-2">
      <i class="pi pi-users" />
      <span class="text-lg">Miembros</span>
    </article>
    <div
      v-for="(detail, index) in preview.details"
      :key="index"
      class="flex items-center justify-between"
    >
      <article class="flex items-center gap-2 ml-6">
        <i class="pi pi-user" />
        <span>{{ detail.user }}</span>
      </article>
      <span class="text-muted-color font-medium">
        S/{{ detail.amount.toFixed(2) }}
      </span>
    </div>
    <div v-if="preview.splitted" class="flex items-center justify-between">
      <article class="flex items-center gap-2 ml-6">
        <i class="pi pi pi-user" />
        <span class="text-lg">{{ preview.user.name }}</span>
      </article>
      <span class="text-muted-color font-medium">
        S/{{ preview.details[0].amount.toFixed(2) }}
      </span>
    </div>
    <div class="flex items-center justify-between">
      <article class="flex items-center gap-2">
        <i class="pi pi-money-bill" />
        <span class="text-lg">Total</span>
      </article>
      <span class="text-muted-color font-medium">
        S/{{ preview.amount.toFixed(2) }}
      </span>
    </div>
    <span class="text-right font-semibold text-lg mt-5">
      ¿Está seguro que desea continuar?
    </span>
    <div class="flex justify-end gap-2">
      <Button label="No" severity="secondary" outlined @click="close" />
      <Button label="Si, guardar" icon="pi pi-check" @click="confirm" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from "vue";
import type { DynamicDialogInstance } from "primevue/dynamicdialogoptions";

const emit = defineEmits<{ (e: "save"): void }>();

const dialogRef = inject<{ value: DynamicDialogInstance }>("dialogRef");

const preview = computed(() => dialogRef?.value.data);

const close = () => dialogRef?.value.close();

const confirm = () => {
  emit("save");
  close();
};
</script>
