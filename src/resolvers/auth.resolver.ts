import { zodResolver } from '@primevue/forms/resolvers/zod'
import z from 'zod'

export const authResolver = zodResolver(
  z.object({
    email: z.string().min(1, 'Correo es requerido').email('Correo no válido'),
    password: z.string().min(1, 'Contraseña es requerida'),
  }),
)
