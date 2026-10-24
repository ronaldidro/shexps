<template>
  <UserForm mode="info" :initialValues="currentUser" @submit="onSubmit" :loading />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { User, UserPayload } from '@/types/user'
import UserForm from '@/components/users/UserForm.vue'
import { authService } from '@/services/auth.service'
import { usersService } from '@/services/users.service'
import { getErrorMessage } from '@/services/axios'
import { useNotification } from '@/composables/useNotification'
import { useAuthStore } from '@/stores/auth.store'

const { showToast } = useNotification()
const { setAuthUser } = useAuthStore()

const currentUser = ref<User>(await authService.me())
const loading = ref(false)

const onSubmit = async (values: UserPayload) => {
  loading.value = true

  try {
    const updatedUser = await usersService.update(currentUser.value?.id as string, values)

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
