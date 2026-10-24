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
    <Button type="submit" label="Guardar" class="ml-auto" icon="pi pi-check" :loading="updating" />
  </Form>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from '@primevue/forms'
import { passwordResolver } from '@/resolvers/password.resolver'
import { useNotification } from '@/composables/useNotification'
import { useUserQuery } from '@/composables/query/useUserQuery'

const { showToast } = useNotification()
const { updatePassword } = useUserQuery()

const { mutate: changePassword, isPending: updating } = updatePassword()

const onSubmit = async (form: FormSubmitEvent) => {
  if (!form.valid) return

  const { current, renewed } = form.values

  changePassword(
    { payload: { current, renewed } },
    {
      onSuccess: () => {
        form.reset()
        showToast({ severity: 'success', summary: 'Contraseña actualizada correctamente' })
      },
    },
  )
}
</script>
