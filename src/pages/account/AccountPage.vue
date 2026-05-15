<template>
  <AppBreadcrumb :items="[{ label: 'Mi cuenta' }, { label: 'Información' }]" />
  <div class="card">
    <Form
      ref="formRef"
      v-slot="$form"
      :resolver="userResolver"
      @submit="onSubmit"
      class="flex flex-col gap-4 w-full md:max-w-xs"
    >
      <div class="flex flex-col gap-2">
        <label for="firstName">Nombres</label>
        <InputText
          id="firstName"
          name="firstName"
          type="text"
          placeholder="Ingresa tus nombres"
          fluid
        />
        <Message
          v-if="$form.firstName?.invalid"
          severity="error"
          variant="simple"
        >
          {{ $form.firstName.error?.message }}
        </Message>
      </div>
      <div class="flex flex-col gap-2">
        <label for="lastName">Apellidos</label>
        <InputText
          name="lastName"
          type="text"
          placeholder="Ingresa tus apellidos"
          fluid
        />
        <Message
          v-if="$form.lastName?.invalid"
          severity="error"
          variant="simple"
        >
          {{ $form.lastName.error?.message }}
        </Message>
      </div>
      <div class="flex flex-col gap-2">
        <label for="lastName">Correo electrónico</label>
        <InputText
          name="email"
          type="email"
          placeholder="Ingresa tu correo"
          fluid
        />
        <Message v-if="$form.email?.invalid" severity="error" variant="simple">
          {{ $form.email.error?.message }}
        </Message>
      </div>
      <Button type="submit" label="Guardar" />
    </Form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { isAxiosError } from "axios";
import { authService } from "@/services/auth.service";
import { usersService } from "@/services/users.service";
import { userResolver } from "@/resolvers/user.resolver";
import { useToast } from "primevue";
import type { FormSubmitEvent } from "@primevue/forms";
import AppBreadcrumb from "@/layout/AppBreadcrumb.vue";
import type { User } from "@/types/user";

const toast = useToast();

const currentUser = ref<User | null>(null);
const formRef = ref();

onMounted(async () => {
  const user = await authService.me();
  currentUser.value = user;
  formRef.value?.setValues(user);
});

const onSubmit = async (form: FormSubmitEvent) => {
  if (!currentUser.value) return;

  if (form.valid) {
    const {
      values: { firstName, lastName, email, password },
    } = form;

    try {
      const updatedUser = await usersService.update(currentUser.value.id, {
        firstName,
        lastName,
        email,
        password,
      });

      currentUser.value = updatedUser;

      toast.add({
        severity: "success",
        summary: "Datos actualizados correctamente",
        life: 3000,
      });
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
