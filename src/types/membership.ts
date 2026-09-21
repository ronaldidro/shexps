import type { Group } from './group'
import type { User } from './user'

export interface Membership {
  id: string
  budget: number | null
  user: User
  group: Group
}

export type MembershipPayload = Partial<Membership>
