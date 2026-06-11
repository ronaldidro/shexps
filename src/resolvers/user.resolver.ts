import { zodResolver } from '@primevue/forms/resolvers/zod'
import { z } from 'zod'

export const userResolver = zodResolver(
  z.object({
    firstName: z.string().min(1, 'Nombres es requerido'),
    lastName: z.string().min(1, 'Apellidos es requerido'),
    email: z.string().min(1, 'Correo es requerido').email('Correo no válido'),
  }),
)
