<template>
  <AppBreadcrumb :items="[{ label: 'Configuración' }, { label: 'Grupos' }]" />
  <Toolbar class="mb-7">
    <template #start>
      <IconField>
        <InputIcon>
          <i class="pi pi-search" />
        </InputIcon>
        <InputText placeholder="Buscar por nombre" />
      </IconField>
    </template>
    <template #end>
      <Button label="Nuevo" icon="pi pi-plus" @click="openDialog" />
    </template>
  </Toolbar>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-7">
    <div v-for="(item, index) in groups" :key="index" class="card mb-0!">
      <div class="flex items-center justify-between gap-10">
        <p class="text-xl font-medium mb-0!">
          {{ item.name }}
        </p>
        <div class="flex gap-3">
          <Button asChild v-slot="slotProps" rounded>
            <RouterLink
              :class="slotProps.class"
              :to="{ name: 'group', params: { id: item.id } }"
            >
              <i class="pi pi-pencil" />
            </RouterLink>
          </Button>
          <Button
            icon="pi pi-times"
            severity="danger"
            rounded
            @click="openConfirmDialog(item.id)"
          />
        </div>
      </div>
      <p class="text-primary font-medium">{{ item.members }} miembro(s)</p>
      <p class="text-muted-color font-medium">Creado el {{ item.createdAt }}</p>
    </div>
  </div>
  <GroupDialog v-model:visible="showDialog" @onSubmit="handleCreate" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import GroupDialog from "@/components/groups/GroupDialog.vue";
import AppBreadcrumb from "@/layout/AppBreadcrumb.vue";
import { groupsService } from "@/services/groups.service";
import type { Group, GroupPayload } from "@/types/group";
import { useConfirm } from "primevue";
import { getErrorMessage } from "@/services/axios";
import { useNotification } from "@/composables/useNotification";

const groups = ref<Group[]>(await groupsService.getAll());
const showDialog = ref(false);

const confirm = useConfirm();
const { showToast } = useNotification();

const openDialog = () => (showDialog.value = true);

const openConfirmDialog = (id: string) => {
  confirm.require({
    header: "Eliminar grupo",
    message: "¿Está seguro de que desea continuar?",
    icon: "pi pi-exclamation-triangle",
    rejectProps: {
      label: "No",
      severity: "secondary",
      icon: "pi pi-times",
      text: true,
    },
    acceptProps: {
      label: "Sí",
      severity: "danger",
      icon: "pi pi-check",
      outlined: true,
    },
    accept: () => handleDelete(id),
  });
};

const handleCreate = async (values: GroupPayload) => {
  try {
    await groupsService.create(values);

    groups.value = await groupsService.getAll();

    showToast({
      severity: "success",
      summary: "Grupo registrado correctamente",
    });
  } catch (err) {
    showToast({
      severity: "error",
      summary: "Error",
      detail: getErrorMessage(err),
    });
  }
};

const handleDelete = async (id: string) => {
  try {
    await groupsService.remove(id);

    showToast({
      severity: "success",
      summary: "Grupo eliminado correctamente",
    });

    groups.value = await groupsService.getAll();
  } catch (err) {
    showToast({
      severity: "error",
      summary: "Error",
      detail: getErrorMessage(err),
    });
  }
};
</script>
