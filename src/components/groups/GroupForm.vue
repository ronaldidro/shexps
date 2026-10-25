<template>
  <Form
    v-slot="$form"
    :resolver="groupResolver"
    :initialValues
    @submit="submit"
    class="flex flex-col gap-4"
  >
    <div class="flex flex-col gap-2">
      <label for="name">Nombre</label>
      <InputText id="name" name="name" type="text" placeholder="Nombre del grupo" fluid />
      <Message v-if="$form.name?.invalid" severity="error" variant="simple">
        {{ $form.name.error?.message }}
      </Message>
    </div>
    <div class="flex flex-col gap-2">
      <label for="members">Miembros</label>
      <div class="flex flex-col gap-2">
        <MultiSelect
          name="members"
          :showToggleAll="false"
          :options="users"
          :loading="fetching"
          optionLabel="firstName"
          optionValue="id"
          placeholder="Selecciona miembros"
        />
        <Message v-if="$form.members?.invalid" severity="error" variant="simple">
          {{ $form.members.error?.message }}
        </Message>
      </div>
    </div>
    <div class="flex items-center justify-between">
      <Button
        type="button"
        :label="leftButtonLabel"
        severity="secondary"
        @click="$emit('click:leftButton')"
      />
      <Button type="submit" label="Guardar" icon="pi pi-check" :loading />
    </div>
  </Form>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { FormSubmitEvent } from '@primevue/forms'
import type { GroupPayload } from '@/types/group'
import { groupResolver } from '@/resolvers/group.resolver'
import { useAuthStore } from '@/stores/auth.store'
import { useUserQuery } from '@/composables/query/useUserQuery'

withDefaults(
  defineProps<{
    initialValues?: { name: string; members: string[] }
    leftButtonLabel: string
    loading: boolean
  }>(),
  { initialValues: () => ({ name: '', members: [] }) },
)

const emit = defineEmits<{ submit: [values: GroupPayload]; 'click:leftButton': [void] }>()

const { user: authUser } = useAuthStore()
const { findAll } = useUserQuery()

const { data: guestUsers, isLoading: fetching } = findAll({ role: 'guest' })

const users = computed(() => {
  if (!guestUsers.value?.length) return []
  return guestUsers.value.filter((user) => user.id !== authUser.id)
})

const submit = (form: FormSubmitEvent) => {
  if (!form.valid) return
  emit('submit', form.values as GroupPayload)
}
</script>
