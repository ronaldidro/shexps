<template>
  <Dialog
    :visible="visible"
    @update:visible="close"
    :style="{ width: '300px' }"
    header="Nuevo grupo"
    :modal="true"
  >
    <Form
      v-slot="$form"
      :resolver="groupResolver"
      :initialValues="{ name: '', members: [] }"
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
      <div class="flex justify-end">
        <Button label="Cancelar" icon="pi pi-times" text @click="close" />
        <Button label="Guardar" type="submit" icon="pi pi-check" />
      </div>
    </Form>
  </Dialog>
</template>

<script setup lang="ts">
import { groupResolver } from "@/resolvers/group.resolver";
import { usersService } from "@/services/users.service";
import type { User } from "@/types/user";
import type { FormSubmitEvent } from "@primevue/forms";
import { onMounted, ref } from "vue";

defineProps<{ visible: boolean }>();

const emit = defineEmits<{
  (e: "update:visible", value: boolean): void;
  (e: "onSubmit", form: FormSubmitEvent): void;
}>();

const submit = (form: FormSubmitEvent) => {
  if (form.valid) {
    emit("onSubmit", form);
    emit("update:visible", false);
  }
};

const close = () => {
  emit("update:visible", false);
};

const users = ref<User[]>([]);

onMounted(async () => {
  users.value = await usersService.getAll();
});
</script>
