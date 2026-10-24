import type { Role } from '@/types/user'

export interface SignInPayload {
  email: string
  password: string
}

export interface SignInResponse {
  accessToken: string
}

export interface AuthUser {
  id: string | null
  name: string | null
  token: string | null
  role: Role
  hasNotifications: boolean
}
