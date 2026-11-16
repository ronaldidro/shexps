import type { AuthUser } from '@/types/auth'
import type { Group } from '@/types/group'
import type { User } from '@/types/user'

type PayMethod = 'transfer' | 'cash' | 'yape'

export interface Payment {
  id: string
  description: string
  debt: string
  amount: string
  remaining: string
  createdAt: string
  closedAt: string
  method: PayMethod
  group: Group
  user: User
  payer: User
}

export interface PaymentPayload {
  description: string
  debt: number
  amount: number
  remaining: number
  method: PayMethod
  group: string
  payer: string
  closedAt: string
}

export type PaymentPreview = PaymentPayload & { remaining: number } & { user: AuthUser }
