export * from './vite'

export const PAY_DESCRIPTION = {
  transfer: 'Transferencia',
  cash: 'Efectivo',
  yape: 'Yape',
}

export const HTTP_STATUS_CODE = {
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
}

export const payMethods = Object.entries(PAY_DESCRIPTION).map(([value, label]) => ({
  label,
  value,
}))
