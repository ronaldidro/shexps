import { defineStore } from 'pinia'
import { reactive } from 'vue'
import { authService } from '@/services/auth.service'
import type { Role, User } from '@/types/user'
import type { SignInPayload, AuthUser } from '@/types/auth'
import router from '@/router'

export const useAuthStore = defineStore(
  'auth',
  () => {
    const user = reactive<AuthUser>({
      id: null,
      name: null,
      token: null,
      role: 'guest',
      hasNotifications: false,
    })

    const signIn = async (payload: SignInPayload) => {
      const response = await authService.signIn(payload)
      user.token = response.accessToken

      const me = await authService.me()
      user.id = me.id
      user.name = me.firstName
      user.role = me.role
      user.hasNotifications = me.notificationsCount > 0

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

    const setHasNotifications = (status: boolean) => (user.hasNotifications = status)

    const hasRole = (roles: Role[]) => roles.includes(user.role)

    return { user, signIn, logout, setAuthUser, setHasNotifications, hasRole }
  },
  { persist: true },
)
