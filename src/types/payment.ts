import type { Group } from './group'
import type { User } from './user'

type PayMethod = 'transfer' | 'cash' | 'yape'

export interface Payment {
  id: string
  description: string
  debt: string
  amount: string
  remaining: string
  createdAt: string
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
}
