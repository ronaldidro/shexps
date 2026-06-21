import { zodResolver } from '@primevue/forms/resolvers/zod'
import { z } from 'zod'

export const passwordResolver = zodResolver(
  z
    .object({
      current: z.string({ message: 'Contraseña actual es requerida' }),
      renewed: z
        .string({ message: 'Nueva contraseña es requerida' })
        .min(8, 'Contraseña debe tener mínimo 8 caracteres')
        .refine((value) => /[A-Za-z]/.test(value), {
          message: 'Contraseña debe tener al menos una letra',
        })
        .refine((value) => /\d/.test(value), {
          message: 'Contraseña debe tener al menos un número',
        }),
      confirmed: z.string({
        message: 'Confirmación de contraseña es requerido',
      }),
    })
    .refine(
      (data) => {
        if (!data.renewed) return true
        return data.renewed === data.confirmed
      },
      {
        message: 'Las contraseñas no coinciden',
        path: ['confirmed'],
      },
    ),
)
