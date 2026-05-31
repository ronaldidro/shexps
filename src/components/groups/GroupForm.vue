<template>
  <Form
    v-slot="$form"
    :resolver="groupResolver"
    :initialValues
    @submit="submit"
    class="flex flex-col gap-4"
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
      <label for="members">Miembros</label>
      <div class="flex flex-col gap-2">
        <MultiSelect
          name="members"
          :options="users"
          optionLabel="fullName"
          optionValue="id"
          :showToggleAll="false"
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
    <Button type="submit" label="Guardar" icon="pi pi-check" class="ml-auto" />
  </Form>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { groupResolver } from "@/resolvers/group.resolver";
import { usersService } from "@/services/users.service";
import type { User } from "@/types/user";
import type { GroupPayload } from "@/types/group";
import type { FormSubmitEvent } from "@primevue/forms";

withDefaults(
  defineProps<{
    initialValues?: { name: string; members: string[] };
  }>(),
  {
    initialValues: () => ({ name: "", members: [] }),
  },
);

const emit = defineEmits<{ (e: "submit", values: GroupPayload): void }>();

const submit = (form: FormSubmitEvent) => {
  if (!form.valid) return;
  emit("submit", form.values as GroupPayload);
};

const users = ref<User[]>(await usersService.getAll());
</script>
