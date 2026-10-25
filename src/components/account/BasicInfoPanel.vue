<template>
  <div v-if="fetching" class="text-center pt-5">
    <ProgressSpinner style="width: 50px; height: 50px" />
  </div>
  <UserForm v-else mode="info" :initialValues="user" :loading="updating" @submit="onSubmit" />
</template>

<script setup lang="ts">
import type { UserPayload } from '@/types/user'
import UserForm from '@/components/users/UserForm.vue'
import { useNotification } from '@/composables/useNotification'
import { useUserQuery } from '@/composables/query/useUserQuery'
import { useAuthStore } from '@/stores/auth.store'

const { showToast } = useNotification()
const { user: authUser, setAuthUser } = useAuthStore()
const { findOne, update } = useUserQuery()

const { data: user, isLoading: fetching } = findOne(authUser.id as string)
const { mutate: updateUser, isPending: updating } = update({ withKey: false })

const onSubmit = async (values: UserPayload) => {
  if (!user.value) return

  updateUser(
    { id: user.value?.id, payload: values },
    {
      onSuccess: (user) => {
        setAuthUser(user)
        showToast({ severity: 'success', summary: 'Datos actualizados correctamente' })
      },
    },
  )
}
</script>
