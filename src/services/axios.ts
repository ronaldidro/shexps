import axios, { isAxiosError } from 'axios'
import { useAuthStore } from '@/stores/auth.store'
import { API_URL } from '@/utils'

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const { user } = useAuthStore()

  if (user.token) config.headers.Authorization = `Bearer ${user.token}`

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { logout } = useAuthStore()
    const status = error.response?.status

    if (status === 401) logout()

    return Promise.reject(error)
  },
)

export const getErrorMessage = (error: unknown) =>
  isAxiosError(error)
    ? error.response?.data?.message || error.message
    : 'Ocurrió un error inesperado'

export const getError = (error: unknown) => (isAxiosError(error) ? error : null)

export default api
