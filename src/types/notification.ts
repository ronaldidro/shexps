export type NotificationType =
  | 'expense_created'
  | 'expense_deleted'
  | 'payment_created'
  | 'budget_exceeded'
  | 'budget_tight'

export interface Notification {
  id: string
  title: string
  description: string
  type: NotificationType
  isRead: boolean
  createdAt: string
}

export type NotificationPayload = Partial<Notification>
