import { zodResolver } from '@primevue/forms/resolvers/zod'
import z from 'zod'

export const paymentResolver = zodResolver(
  z
    .object({
      closedAt: z.preprocess(
        (val) => {
          if (val === '' || val === null || !(val instanceof Date)) return
          return val.toISOString()
        },
        z.string().min(1, 'Fecha es requerida'),
      ),
      group: z.string().min(1, 'Grupo es requerido'),
      payer: z.string().min(1, 'Miembro es requerido'),
      amount: z
        .union([z.number().gt(0, { message: 'Pago debe ser mayor que 0' }), z.literal(null)])
        .refine((val) => val !== null, { message: 'Pago es requerido' }),
      debt: z.number(),
      method: z.string().min(1, 'Método es requerido'),
      description: z.string().min(1, 'Descripción es requerida'),
    })
    .refine(
      (data) => {
        if (!data.amount) return true
        return data.amount <= data.debt
      },
      {
        message: 'Pago no puede ser mayor a la deuda',
        path: ['amount'],
      },
    ),
)
