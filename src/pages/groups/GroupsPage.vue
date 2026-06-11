<template>
  <AppBreadcrumb :items="[{ label: 'Configuración' }, { label: 'Grupos' }]" />
  <Toolbar class="mb-7">
    <template #start>
      <InputGroup>
        <InputText placeholder="Buscar" />
        <Button icon="pi pi-search" />
      </InputGroup>
    </template>
    <template #end>
      <Button label="Nuevo" icon="pi pi-plus" @click="showDialog = true" />
    </template>
  </Toolbar>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-7">
    <div v-for="(group, index) in groups" :key="index" class="card mb-0!">
      <div class="flex items-center justify-between gap-10">
        <p class="text-xl font-medium mb-0!">
          {{ group.name }}
        </p>
        <div v-if="group.user.id === user.id" class="flex gap-3">
          <Button asChild v-slot="slotProps" rounded>
            <RouterLink
              :class="slotProps.class"
              :to="{ name: 'group', params: { id: group.id } }"
            >
              <i class="pi pi-pencil" />
            </RouterLink>
          </Button>
          <Button
            icon="pi pi-times"
            severity="danger"
            rounded
            @click="openConfirmDialog(group.id)"
          />
        </div>
      </div>
      <p class="text-primary font-medium">{{ group.members }} miembro(s)</p>
      <p class="text-muted-color font-medium">
        Creado el {{ group.createdAt }}
      </p>
      <Accordion>
        <AccordionPanel value="0">
          <AccordionHeader class="px-0!">Miembros</AccordionHeader>
          <AccordionContent unstyled class="pb-4">
            <div class="flex flex-wrap gap-2">
              <Tag v-for="membership in group.memberships" :key="membership.id">
                {{ membership.user.firstName }}
                <span v-if="membership.user.id === group.user.id">(C)</span>
              </Tag>
            </div>
          </AccordionContent>
        </AccordionPanel>
      </Accordion>
    </div>
  </div>
  <GroupDialog v-model:visible="showDialog" @onSubmit="handleCreate" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useConfirm } from "primevue";
import type { Group, GroupPayload } from "@/types/group";
import GroupDialog from "@/components/groups/GroupDialog.vue";
import AppBreadcrumb from "@/layout/AppBreadcrumb.vue";
import { groupsService } from "@/services/groups.service";
import { getErrorMessage } from "@/services/axios";
import { useNotification } from "@/composables/useNotification";
import { useAuthStore } from "@/stores/auth.store";

const groups = ref<Group[]>(await groupsService.getAll());
const showDialog = ref(false);

const { showToast } = useNotification();
const { user } = useAuthStore();
const confirm = useConfirm();

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
