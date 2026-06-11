import type { User } from '@/types/user'
import type { SignInPayload, SignInResponse } from '@/types/auth'
import api, { getErrorMessage } from '@/services/axios'

export const authService = {
  async signIn(payload: SignInPayload) {
    const { data } = await api.post<SignInResponse>('/auth/sign-in', payload)
    return data
  },

  async me() {
    try {
      const response = await api.get<User>('/auth/me')
      return response.data
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  },
}
