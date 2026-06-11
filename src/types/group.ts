import type { User } from './user'

interface Membership {
  id: string
  user: User
  group: Group
}

export interface Group {
  id: string
  name: string
  createdAt: string
  members: number
  user: User
  memberships: Membership[]
}

export interface GroupPayload {
  name: string
  members: string[]
}
