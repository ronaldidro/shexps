<template>
  <AppBreadcrumb :items="[{ label: 'Contraseña' }]" />
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
        <Message v-if="$form.passwordConfirmation?.invalid" severity="error" variant="simple">
          {{ $form.passwordConfirmation.error?.message }}
        </Message>
      </div>
      <Button type="submit" label="Guardar" class="ml-auto" icon="pi pi-check" :loading />
    </Form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AppBreadcrumb from '@/layout/AppBreadcrumb.vue'
import { passwordResolver } from '@/resolvers/password.resolver'
import { usersService } from '@/services/users.service'
import { getErrorMessage } from '@/services/axios'
import { useAuthStore } from '@/stores/auth.store'
import type { FormSubmitEvent } from '@primevue/forms'
import { useNotification } from '@/composables/useNotification'

const { user } = useAuthStore()
const { showToast } = useNotification()

const loading = ref(false)

const onSubmit = async (form: FormSubmitEvent) => {
  if (!form.valid) return

  loading.value = true

  try {
    await usersService.update(user.id as string, { password: form.values.password })

    form.reset()

    showToast({ severity: 'success', summary: 'Contraseña actualizada correctamente' })
  } catch (err) {
    showToast({ severity: 'error', summary: 'Error', detail: getErrorMessage(err) })
  } finally {
    loading.value = false
  }
}
</script>
