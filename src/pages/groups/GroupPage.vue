<template>
  <AppBreadcrumb :items />
  <div class="card">
    <Form
      ref="formRef"
      v-slot="$form"
      :resolver="groupResolver"
      @submit="onSubmit"
      class="flex flex-col gap-4 w-full md:max-w-xs"
    >
      <div class="flex flex-col gap-2">
        <label for="name">Nombre</label>
        <InputText
          id="name"
          name="name"
          type="text"
          placeholder="Nombre del grupo"
          fluid
        />
        <Message v-if="$form.name?.invalid" severity="error" variant="simple">
          {{ $form.name.error?.message }}
        </Message>
      </div>
      <div class="flex flex-col gap-2">
        <label for="name">Miembros</label>
        <div class="flex flex-col gap-2">
          <MultiSelect
            name="members"
            :options="users"
            optionLabel="firstName"
            optionValue="id"
            display="chip"
            filter
            placeholder="Selecciona miembros"
          />
          <Message
            v-if="$form.members?.invalid"
            severity="error"
            variant="simple"
          >
            {{ $form.members.error?.message }}
          </Message>
        </div>
      </div>
      <Button type="submit" label="Guardar" />
    </Form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import AppBreadcrumb from "@/layout/AppBreadcrumb.vue";
import type { Group } from "@/types/group";
import type { User } from "@/types/user";
import { groupsService } from "@/services/groups.service";
import { usersService } from "@/services/users.service";
import { useRoute } from "vue-router";
import { Form, type FormSubmitEvent } from "@primevue/forms";
import { groupResolver } from "@/resolvers/group.resolver";
import { useToast } from "primevue";
import { isAxiosError } from "axios";
import router from "@/router";

const route = useRoute();
const toast = useToast();

const formRef = ref();
const group = ref<Group | null>(null);
const users = ref<User[]>([]);
const items = ref([
  { label: "Configuración" },
  { label: "Grupos", route: "/groups" },
]);

onMounted(async () => {
  group.value = await groupsService.get(route.params.id as string);
  users.value = await usersService.getAll();
  items.value = [...items.value, { label: group.value.name }];
  const members = group.value.memberships.map((member) => member.user.id);
  formRef.value?.setValues({ ...group.value, members });
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
</script>
