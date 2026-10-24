import { zodResolver } from '@primevue/forms/resolvers/zod'
import { z } from 'zod'

const baseSchema = z.object({
  firstName: z.string().min(1, 'Nombres es requerido'),
  lastName: z.string().min(1, 'Apellidos es requerido'),
  email: z.string().min(1, 'Correo es requerido').email('Correo no válido'),
})

export const infoResolver = zodResolver(baseSchema)

export const manageResolver = zodResolver(
  baseSchema.extend({
    password: z.preprocess(
      (val) => (val === '' ? undefined : val),
      z
        .string()
        .min(8, 'Contraseña debe tener mínimo 8 caracteres')
        .refine((value) => /[A-Za-z]/.test(value), {
          message: 'Contraseña debe tener al menos una letra',
        })
        .refine((value) => /\d/.test(value), {
          message: 'Contraseña debe tener al menos un número',
        })
        .or(z.literal(''))
        .optional(),
    ),
    role: z.string().min(1, 'Rol es requerido'),
  }),
)
