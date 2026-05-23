<template>
  <AppBreadcrumb
    :items="[{ label: 'Perfil' }, { label: 'Cambiar contraseña' }]"
  />
  <div class="card md:max-w-sm">
    <Form
      v-slot="$form"
      :resolver="passwordResolver"
      @submit="onSubmit"
      class="flex flex-col gap-4"
    >
      <div class="flex flex-col gap-2">
        <label for="password">Nueva contraseña</label>
        <Password
          name="password"
          type="password"
          placeholder="Ingresa nueva contraseña"
          :feedback="false"
          toggleMask
          fluid
        />
        <template v-if="$form.password?.invalid">
          <Message
            v-for="(error, index) of $form.password.errors"
            :key="index"
            severity="error"
            variant="simple"
          >
            {{ error.message }}
          </Message>
        </template>
      </div>
      <div class="flex flex-col gap-2">
        <label for="passwordConfirmation">Confirmar contraseña</label>
        <Password
          name="passwordConfirmation"
          type="password"
          placeholder="Confirma nueva contraseña"
          :feedback="false"
          toggleMask
          fluid
        />
        <Message
          v-if="$form.passwordConfirmation?.invalid"
          severity="error"
          variant="simple"
        >
          {{ $form.passwordConfirmation.error?.message }}
        </Message>
      </div>
      <Button
        type="submit"
        label="Guardar"
        class="ml-auto"
        icon="pi pi-check"
        :loading
      />
    </Form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import AppBreadcrumb from "@/layout/AppBreadcrumb.vue";
import { passwordResolver } from "@/resolvers/password.resolver";
import { authService } from "@/services/auth.service";
import { usersService } from "@/services/users.service";
import type { FormSubmitEvent } from "@primevue/forms";
import { isAxiosError } from "axios";
import { useToast } from "primevue";

const toast = useToast();

const loading = ref(false);

const onSubmit = async (form: FormSubmitEvent) => {
  if (form.valid) {
    loading.value = true;

    try {
      const user = await authService.me();

      await usersService.update(user.id, { password: form.values.password });

      form.reset();

      toast.add({
        severity: "success",
        summary: "Contraseña actualizada correctamente",
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
    } finally {
      loading.value = false;
    }
  }
};
</script>
