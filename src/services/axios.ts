import { useAuthStore } from '@/stores/auth.store'
import axios, { isAxiosError } from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
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

export default api
