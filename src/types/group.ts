import type { Membership } from '@/types/membership'
import type { User } from '@/types/user'

export interface Group {
  id: string
  name: string
  createdAt: string
  members: number
  user: User
  memberships: Membership[]
  discordWebhook?: string
}

export interface GroupPayload {
  name: string
  members: string[]
  discordWebhook?: string
}
