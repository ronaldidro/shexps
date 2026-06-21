<template>
  <Form v-slot="$form" :resolver="passwordResolver" @submit="onSubmit" class="flex flex-col gap-4">
    <div class="flex flex-col gap-2">
      <label for="current">Contraseña actual</label>
      <Password
        name="current"
        type="password"
        placeholder="Ingresa contraseña actual"
        :feedback="false"
        toggleMask
        fluid
      />
      <template v-if="$form.current?.invalid">
        <Message
          v-for="(error, index) of $form.current.errors"
          :key="index"
          severity="error"
          variant="simple"
        >
          {{ error.message }}
        </Message>
      </template>
    </div>
    <div class="flex flex-col gap-2">
      <label for="renewed">Nueva contraseña</label>
      <Password
        name="renewed"
        type="password"
        placeholder="Ingresa nueva contraseña"
        :feedback="false"
        toggleMask
        fluid
      />
      <template v-if="$form.renewed?.invalid">
        <Message
          v-for="(error, index) of $form.renewed.errors"
          :key="index"
          severity="error"
          variant="simple"
        >
          {{ error.message }}
        </Message>
      </template>
    </div>
    <div class="flex flex-col gap-2">
      <label for="confirmed">Confirmar contraseña</label>
      <Password
        name="confirmed"
        type="password"
        placeholder="Confirma nueva contraseña"
        :feedback="false"
        toggleMask
        fluid
      />
      <Message v-if="$form.confirmed?.invalid" severity="error" variant="simple">
        {{ $form.confirmed.error?.message }}
      </Message>
    </div>
    <Button type="submit" label="Guardar" class="ml-auto" icon="pi pi-check" :loading />
  </Form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { FormSubmitEvent } from '@primevue/forms'
import { passwordResolver } from '@/resolvers/password.resolver'
import { usersService } from '@/services/users.service'
import { getErrorMessage } from '@/services/axios'
import { useNotification } from '@/composables/useNotification'

const { showToast } = useNotification()

const loading = ref(false)

const onSubmit = async (form: FormSubmitEvent) => {
  if (!form.valid) return

  loading.value = true

  try {
    const { current, renewed } = form.values
    await usersService.updatePassword({ current, renewed })

    form.reset()

    showToast({ severity: 'success', summary: 'Contraseña actualizada correctamente' })
  } catch (err) {
    showToast({ severity: 'error', summary: 'Error', detail: getErrorMessage(err) })
  } finally {
    loading.value = false
  }
}
</script>
