<template>
  <div>
    <h1>Login</h1>

    <form @submit="onSubmit">
      <div>
        <label for="email">Email</label>
        <Field id="email" name="email" type="email" />
        <ErrorMessage name="email" as="p" />
      </div>

      <div>
        <label for="password">Password</label>
        <Field id="password" name="password" type="password" />
        <ErrorMessage name="password" as="p" />
      </div>

      <button type="submit" :disabled="isSubmitting">
        {{ isSubmitting ? "Ingresando..." : "Iniciar sesión" }}
      </button>
    </form>

    <p v-if="error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { Field, ErrorMessage, useForm } from "vee-validate";
import { isAxiosError } from "axios";
import { useAuthStore } from "@/stores/auth.store";
import { loginSchema } from "@/schemas/auth.schema";
import type { LoginPayload } from "@/types/auth";

const router = useRouter();
const authStore = useAuthStore();

const error = ref("");

const { handleSubmit, isSubmitting } = useForm<LoginPayload>({
  validationSchema: loginSchema,
  initialValues: { email: "", password: "" },
});

const onSubmit = handleSubmit(async (values) => {
  try {
    error.value = "";

    await authStore.login(values);

    router.push("/");
  } catch (err) {
    if (isAxiosError(err))
      error.value = err.response?.data?.message || "Ocurrió un error";
    else error.value = "Ocurrió un error inesperado";
  }
});
</script>
