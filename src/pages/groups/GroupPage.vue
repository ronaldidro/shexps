<template>
  <AppBreadcrumb :items />
  <div class="card md:max-w-sm">
    <GroupForm
      v-if="group"
      :initialValues="{ name: group.name, members }"
      @submit="onSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import AppBreadcrumb from "@/layout/AppBreadcrumb.vue";
import type { Group } from "@/types/group";
import { groupsService } from "@/services/groups.service";
import { useRoute } from "vue-router";
import type { FormSubmitEvent } from "@primevue/forms";
import { useToast } from "primevue";
import { isAxiosError } from "axios";
import router from "@/router";
import GroupForm from "@/components/groups/GroupForm.vue";

const route = useRoute();
const toast = useToast();

const group = ref<Group | null>(null);
const items = ref([
  { label: "Configuración" },
  { label: "Grupos", route: "/groups" },
]);

const members = computed(() => {
  if (!group.value) return [];
  return group.value.memberships.map((membership) => membership.user.id);
});

const onSubmit = async (form: FormSubmitEvent) => {
  if (!group.value) return;

  if (form.valid) {
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
      const message = isAxiosError(err)
        ? err.response?.data?.message || err.message
        : "Ocurrió un error inesperado";

      toast.add({
        severity: "error",
        summary: "Error",
        detail: message,
        life: 3000,
      });
    }
  }
};

onMounted(async () => {
  group.value = await groupsService.get(route.params.id as string);
  items.value = [...items.value, { label: group.value.name }];
});
</script>
