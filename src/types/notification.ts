type NotificationType = 'expense_created' | 'expense_deleted' | 'payment_created'

export interface Notification {
  id: string
  title: string
  description: string
  type: NotificationType
  isRead: boolean
  createdAt: string
}

export type NotificationPayload = Partial<Notification>
