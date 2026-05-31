<template>
  <AppBreadcrumb :items />
  <div class="card md:max-w-sm" v-if="group">
    <GroupForm
      :initialValues="{ name: group.name, members }"
      @submit="onSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import AppBreadcrumb from "@/layout/AppBreadcrumb.vue";
import type { Group } from "@/types/group";
import { groupsService } from "@/services/groups.service";
import { useRoute } from "vue-router";
import type { FormSubmitEvent } from "@primevue/forms";
import { useToast } from "primevue";
import router from "@/router";
import GroupForm from "@/components/groups/GroupForm.vue";
import { getErrorMessage } from "@/services/axios";

const route = useRoute();
const toast = useToast();

const group = ref<Group | null>(
  await groupsService.get(route.params.id as string),
);

const members = computed(() => {
  if (!group.value) return [];
  return group.value.memberships.map((membership) => membership.user.id);
});

const items = computed(() => {
  if (!group.value) return [];
  return [
    { label: "Configuración" },
    { label: "Grupos", route: "/groups" },
    { label: group.value.name },
  ];
});

const onSubmit = async (form: FormSubmitEvent) => {
  if (!group.value || !form.valid) return;

  try {
    await groupsService.update(group.value.id, {
      name: form.values.name,
      members: form.values.members,
    });

    toast.add({
      severity: "success",
      summary: "Grupo actualizado correctamente",
      life: 3000,
    });

    router.push({ name: "groups" });
  } catch (err) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: getErrorMessage(err),
      life: 3000,
    });
  }
};
</script>
