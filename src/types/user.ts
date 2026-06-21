export interface User {
  id: string
  firstName: string
  lastName: string
  fullName: string
  email: string
  role: string
}

export interface UpdateUserPayload {
  firstName?: string
  lastName?: string
  email?: string
  password?: string
}

export interface UpdatePasswordPayload {
  current: string
  renewed: string
}

type Role = 'admin' | 'guest'

export interface UserQueryParams {
  role?: Role
}
