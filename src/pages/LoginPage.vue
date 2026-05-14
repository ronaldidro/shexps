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
          placeholder="Contraseña"
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
      <Button type="submit" severity="secondary" label="Iniciar sesión" />
    </Form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useToast } from "primevue/usetoast";
import { authResolver } from "@/resolvers/auth.resolver";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";
import type { FormSubmitEvent } from "@primevue/forms";
import { isAxiosError } from "axios";

const toast = useToast();
const router = useRouter();
const authStore = useAuthStore();

const initialValues = ref({ email: "", password: "" });
const resolver = ref(authResolver);

const onSubmit = async (form: FormSubmitEvent) => {
  const {
    valid,
    values: { email, password },
  } = form;

  if (valid) {
    try {
      await authStore.login({ email, password });

      router.push("/");
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
