<template>
  <div class="card flex justify-center">
    <Form
      v-slot="$form"
      :resolver
      :initialValues
      @submit="onSubmit"
      class="flex flex-col gap-4 w-full sm:w-56"
    >
      <div class="flex flex-col gap-1">
        <InputText name="firstName" type="text" placeholder="Nombres" fluid />
        <Message
          v-if="$form.firstName?.invalid"
          severity="error"
          size="small"
          variant="simple"
        >
          {{ $form.firstName.error?.message }}
        </Message>
      </div>
      <div class="flex flex-col gap-1">
        <InputText name="lastName" type="text" placeholder="Apellidos" fluid />
        <Message
          v-if="$form.lastName?.invalid"
          severity="error"
          size="small"
          variant="simple"
        >
          {{ $form.lastName.error?.message }}
        </Message>
      </div>
      <div class="flex flex-col gap-1">
        <InputText
          name="email"
          type="email"
          placeholder="Correo electrónico"
          fluid
        />
        <Message
          v-if="$form.email?.invalid"
          severity="error"
          size="small"
          variant="simple"
        >
          {{ $form.email.error?.message }}
        </Message>
      </div>
      <div class="flex flex-col gap-1">
        <Password
          name="password"
          type="password"
          placeholder="Nueva contraseña"
          :feedback="false"
          toggleMask
          fluid
        />
        <Message
          v-if="$form.password?.invalid"
          severity="error"
          size="small"
          variant="simple"
        >
          {{ $form.password.error?.message }}
        </Message>
      </div>
      <div class="flex flex-col gap-1">
        <Password
          name="passwordConfirmation"
          type="password"
          placeholder="Confirmar contraseña"
          :feedback="false"
          toggleMask
          fluid
        />
        <Message
          v-if="$form.passwordConfirmation?.invalid"
          severity="error"
          size="small"
          variant="simple"
        >
          {{ $form.passwordConfirmation.error?.message }}
        </Message>
      </div>
      <Button type="submit" severity="secondary" label="Guardar" />
    </Form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { isAxiosError } from "axios";
import { useAuthStore } from "@/stores/auth.store";
import { usersService } from "@/services/users.service";
import { userResolver } from "@/resolvers/user.resolver";
import { useToast } from "primevue";
import type { FormSubmitEvent } from "@primevue/forms";

const toast = useToast();
const authStore = useAuthStore();

const initialValues = ref({
  firstName: "",
  lastName: "",
  email: "",
  password: undefined,
  passwordConfirmation: undefined,
});

const resolver = ref(userResolver);

watch(
  () => authStore.user,
  (user) => {
    if (!user) return;
    initialValues.value = { ...initialValues.value, ...user };
  },
  {
    immediate: true,
  },
);

const onSubmit = async (form: FormSubmitEvent) => {
  if (!authStore.user) return;

  const {
    valid,
    values: { firstName, lastName, email, password },
  } = form;

  if (valid) {
    try {
      const updatedUser = await usersService.update(authStore.user.id, {
        firstName,
        lastName,
        email,
        password,
      });

      authStore.user = updatedUser;

      toast.add({
        severity: "success",
        summary: "Éxito",
        detail: "Datos actualizados correctamente",
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
