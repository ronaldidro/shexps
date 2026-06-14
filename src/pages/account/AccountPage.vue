<template>
  <AppBreadcrumb :items="[{ label: 'Perfil' }]" />
  <div class="card md:max-w-sm">
    <Form
      v-if="currentUser"
      v-slot="$form"
      :resolver="userResolver"
      :initialValues="currentUser"
      @submit="onSubmit"
      class="flex flex-col gap-4"
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
        <Message v-if="$form.firstName?.invalid" severity="error" variant="simple">
          {{ $form.firstName.error?.message }}
        </Message>
      </div>
      <div class="flex flex-col gap-2">
        <label for="lastName">Apellidos</label>
        <InputText name="lastName" type="text" placeholder="Ingresa tus apellidos" fluid />
        <Message v-if="$form.lastName?.invalid" severity="error" variant="simple">
          {{ $form.lastName.error?.message }}
        </Message>
      </div>
      <div class="flex flex-col gap-2">
        <label for="email">Correo electrónico</label>
        <InputText name="email" type="email" placeholder="Ingresa tu correo" fluid />
        <Message v-if="$form.email?.invalid" severity="error" variant="simple">
          {{ $form.email.error?.message }}
        </Message>
      </div>
      <Button type="submit" label="Guardar" icon="pi pi-check" class="ml-auto" :loading />
    </Form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { authService } from '@/services/auth.service'
import { usersService } from '@/services/users.service'
import { userResolver } from '@/resolvers/user.resolver'
import type { FormSubmitEvent } from '@primevue/forms'
import type { User } from '@/types/user'
import { getErrorMessage } from '@/services/axios'
import AppBreadcrumb from '@/layout/AppBreadcrumb.vue'
import { useNotification } from '@/composables/useNotification'
import { useAuthStore } from '@/stores/auth.store'

const { showToast } = useNotification()
const { setAuthUser } = useAuthStore()

const currentUser = ref<User | null>(await authService.me())
const loading = ref(false)

const onSubmit = async (form: FormSubmitEvent) => {
  if (!form.valid) return

  loading.value = true

  try {
    const updatedUser = await usersService.update(currentUser.value?.id as string, form.values)

    currentUser.value = updatedUser
    setAuthUser(updatedUser)

    showToast({ severity: 'success', summary: 'Datos actualizados correctamente' })
  } catch (err) {
    showToast({ severity: 'error', summary: 'Error', detail: getErrorMessage(err) })
  } finally {
    loading.value = false
  }
}
</script>
