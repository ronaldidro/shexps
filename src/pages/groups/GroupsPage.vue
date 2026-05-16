<template>
  <AppBreadcrumb :items="[{ label: 'Configuración' }, { label: 'Grupos' }]" />
  <div class="flex flex-col gap-4 lg:flex-row lg:flex-wrap">
    <div v-for="(item, index) in groups" :key="index" class="card">
      <div class="flex items-center justify-between gap-10 mb-8">
        <p class="text-xl font-medium mb-0!">
          {{ item.name }}
        </p>
        <div class="flex gap-3">
          <Button asChild v-slot="slotProps" rounded outlined>
            <RouterLink
              :class="slotProps.class"
              :to="{ name: 'group', params: { id: item.id } }"
            >
              <i class="pi pi-pencil" />
            </RouterLink>
          </Button>
          <Button
            icon="pi pi-trash"
            severity="danger"
            rounded
            outlined
            @click="openDeleteDialog(item)"
          />
        </div>
      </div>
      <p class="text-primary font-medium">{{ item.members }} miembro(s)</p>
      <p class="text-muted-color font-medium">Creado el {{ item.createdAt }}</p>
    </div>
  </div>
  <DeleteDialog
    v-model:visible="displayConfirmation"
    header="Eliminar grupo"
    message="¿Está seguro de que desea continuar?"
    @confirm="handleDelete"
  />
</template>

<script setup lang="ts">
import DeleteDialog from "@/components/DeleteDialog.vue";
import AppBreadcrumb from "@/layout/AppBreadcrumb.vue";
import { groupsService } from "@/services/groups.service";
import type { Group } from "@/types/group";
import { onMounted, ref } from "vue";

const groups = ref<Group[]>([]);
const selectedGroup = ref<Group | null>(null);
const displayConfirmation = ref(false);

const openDeleteDialog = (group: Group) => {
  selectedGroup.value = group;
  displayConfirmation.value = true;
};

const handleDelete = () => {
  console.log("group", selectedGroup.value);
};

onMounted(async () => {
  groups.value = await groupsService.getAll();
});
</script>
