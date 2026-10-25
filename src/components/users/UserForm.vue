<template>
  <Form
    v-slot="$form"
    :resolver="mode === 'manage' ? manageResolver : infoResolver"
    :initialValues
    @submit="submit"
    class="flex flex-col gap-4"
  >
    <div class="flex flex-col gap-2">
      <label for="firstName">Nombres</label>
      <InputText id="firstName" name="firstName" fluid />
      <Message v-if="$form.firstName?.invalid" severity="error" variant="simple">
        {{ $form.firstName.error?.message }}
      </Message>
    </div>
    <div class="flex flex-col gap-2">
      <label for="lastName">Apellidos</label>
      <InputText name="lastName" fluid />
      <Message v-if="$form.lastName?.invalid" severity="error" variant="simple">
        {{ $form.lastName.error?.message }}
      </Message>
    </div>
    <div class="flex flex-col gap-2">
      <label for="email">Correo electrónico</label>
      <InputText name="email" type="email" fluid />
      <Message v-if="$form.email?.invalid" severity="error" variant="simple">
        {{ $form.email.error?.message }}
      </Message>
    </div>
    <div v-if="mode === 'manage'" class="flex flex-col gap-4">
      <div class="flex flex-col gap-2">
        <label for="password">Contraseña</label>
        <Password name="password" type="password" :feedback="false" toggleMask fluid />
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
        <label for="role">Rol</label>
        <Select
          id="role"
          name="role"
          :options="roles"
          optionLabel="label"
          optionValue="value"
          placeholder="Selecciona rol"
          fluid
        />
        <Message v-if="$form.role?.invalid" severity="error" variant="simple">
          {{ $form.role.error?.message }}
        </Message>
      </div>
    </div>
    <div class="flex items-center" :class="mode === 'manage' ? 'justify-between' : 'justify-end'">
      <Button
        v-if="mode === 'manage'"
        type="button"
        label="Cancelar"
        severity="secondary"
        @click="$emit('cancel')"
      />
      <Button type="submit" label="Guardar" icon="pi pi-check" :loading />
    </div>
  </Form>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from '@primevue/forms'
import type { UserPayload } from '@/types/user'
import { manageResolver, infoResolver } from '@/resolvers/user.resolver'
import { roles } from '@/utils'

defineProps<{ mode: 'info' | 'manage'; initialValues?: UserPayload; loading: boolean }>()

const emit = defineEmits<{ cancel: [void]; submit: [values: UserPayload] }>()

const submit = (form: FormSubmitEvent) => {
  if (!form.valid) return
  emit('submit', form.values as UserPayload)
}
</script>
