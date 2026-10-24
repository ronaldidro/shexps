export const PAY_DESCRIPTION = {
  transfer: 'Transferencia',
  cash: 'Efectivo',
  yape: 'Yape',
}

export const USER_ROLE = {
  admin: 'Administrador',
  guest: 'Invitado',
} as const

export const HTTP_STATUS_CODE = {
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
}

export const payMethods = Object.entries(PAY_DESCRIPTION).map(([value, label]) => ({
  label,
  value,
}))

export const roles = Object.entries(USER_ROLE).map(([value, label]) => ({ label, value }))

export const formatCurrency = (amount: number | string) =>
  Number(amount).toLocaleString('es-PE', { style: 'currency', currency: 'PEN' })

export * from '@/utils/vite'
