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
      <label for="name">Miembros</label>
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
import { onMounted, ref } from "vue";
import { groupResolver } from "@/resolvers/group.resolver";
import { usersService } from "@/services/users.service";
import type { User } from "@/types/user";
import type { FormSubmitEvent } from "@primevue/forms";

interface Props {
  initialValues?: { name: string; members: string[] };
}

withDefaults(defineProps<Props>(), {
  initialValues: () => ({ name: "", members: [] }),
});

const emit = defineEmits<{ (e: "submit", form: FormSubmitEvent): void }>();

const submit = (form: FormSubmitEvent) => emit("submit", form);

const users = ref<User[]>([]);

onMounted(async () => (users.value = await usersService.getAll()));
</script>
