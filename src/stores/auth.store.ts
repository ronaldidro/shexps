import { defineStore } from 'pinia'
import { reactive } from 'vue'
import { authService } from '@/services/auth.service'
import type { User } from '@/types/user'
import type { SignInPayload, AuthUser } from '@/types/auth'
import router from '@/router'

export const useAuthStore = defineStore(
  'auth',
  () => {
    const user = reactive<AuthUser>({ id: null, name: null, token: null })

    const signIn = async (payload: SignInPayload) => {
      const response = await authService.signIn(payload)
      user.token = response.accessToken

      const me = await authService.me()
      user.id = me.id
      user.name = me.firstName

      router.push({ name: 'dashboard' })
    }

    const logout = () => {
      user.id = null
      user.name = null
      user.token = null

      router.push({ name: 'sign-in' })
    }

    const setAuthUser = ({ id, firstName }: User) => {
      user.id = id
      user.name = firstName
    }

    return { user, signIn, logout, setAuthUser }
  },
  { persist: true },
)
