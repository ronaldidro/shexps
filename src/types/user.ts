import type { USER_ROLE } from '@/utils'

export interface User {
  id: string
  firstName: string
  lastName: string
  fullName: string
  email: string
  role: Role
  notificationsCount: number
}

export type UserPayload = Partial<User> & { password?: string }

export interface UpdatePasswordPayload {
  current: string
  renewed: string
}

export type Role = keyof typeof USER_ROLE

export interface UserQueryParams {
  role?: Role
}
