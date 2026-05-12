<template>
  <div>
    <AppNavbar />

    <h1>Mi Cuenta</h1>

    <form v-if="authStore.user" @submit="onSubmit">
      <div>
        <label for="firstName"> Nombre </label>
        <Field id="firstName" name="firstName" type="text" />
        <ErrorMessage name="firstName" as="p" />
      </div>

      <div>
        <label for="lastName"> Apellido </label>
        <Field id="lastName" name="lastName" type="text" />
        <ErrorMessage name="lastName" as="p" />
      </div>

      <div>
        <label for="email"> Email </label>
        <Field id="email" name="email" type="email" />
        <ErrorMessage name="email" as="p" />
      </div>

      <div>
        <label for="password"> Nueva contraseña </label>
        <Field id="password" name="password" type="password" />
        <ErrorMessage name="password" as="p" />
      </div>

      <div>
        <label for="passwordConfirmation"> Confirmar contraseña </label>

        <Field
          id="passwordConfirmation"
          name="passwordConfirmation"
          type="password"
        />

        <ErrorMessage name="passwordConfirmation" as="p" />
      </div>

      <button type="submit" :disabled="isSubmitting">
        {{ isSubmitting ? "Guardando..." : "Guardar cambios" }}
      </button>
    </form>

    <p v-if="success">{{ success }}</p>

    <p v-if="error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { Field, ErrorMessage, useForm } from "vee-validate";
import { isAxiosError } from "axios";
import AppNavbar from "@/components/AppNavbar.vue";
import { useAuthStore } from "@/stores/auth.store";
import { usersService } from "@/services/users.service";
import { updateUserSchema } from "@/schemas/user.schema";
import type { AccountForm } from "@/types/user";

const authStore = useAuthStore();

const success = ref("");
const error = ref("");

const { handleSubmit, isSubmitting, setValues } = useForm<AccountForm>({
  validationSchema: updateUserSchema,
  initialValues: {
    firstName: "",
    lastName: "",
    email: "",
    password: undefined,
    passwordConfirmation: undefined,
  },
});

watch(
  () => authStore.user,
  (user) => {
    if (!user) return;

    setValues({
      ...user,
      password: undefined,
      passwordConfirmation: undefined,
    });
  },
  {
    immediate: true,
  },
);

const onSubmit = handleSubmit(async (values) => {
  if (!authStore.user) return;

  try {
    success.value = "";
    error.value = "";

    const updatedUser = await usersService.update(authStore.user.id, {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      password: values.password || undefined,
    });

    authStore.user = updatedUser;

    success.value = "Datos actualizados correctamente";
  } catch (err) {
    if (isAxiosError(err))
      error.value = err.response?.data?.message || "Ocurrió un error";
    else error.value = "Ocurrió un error inesperado";
  }
});
</script>
