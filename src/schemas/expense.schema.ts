import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'

export const expenseSchema = toTypedSchema(
  z.object({
    group: z.string().min(1, 'Grupo es requerido'),
    expensedAt: z.preprocess(
      (val) => {
        if (val === '' || val === null || !(val instanceof Date)) return ''
        return val.toISOString()
      },
      z.string().min(1, 'Fecha es requerida'),
    ),
    description: z.string().min(1, 'Descripción es requerida'),
    amount: z
      .union([z.number().gt(0, { message: 'Monto total debe ser mayor que 0' }), z.literal(null)])
      .refine((val) => val !== null, { message: 'Monto total es requerido' }),
    splitted: z.boolean(),
    details: z
      .array(
        z.object({
          user: z.string().min(1, 'Miembro es requerido'),
          amount: z
            .union([z.number().gt(0, { message: 'Monto debe ser mayor que 0' }), z.literal(null)])
            .refine((val) => val !== null, { message: 'Monto es requerido' }),
        }),
      )
      .min(1, 'Debes agregar al menos un detalle')
      .superRefine((details, ctx) => {
        const users = new Set()
        details.forEach((detail, index) => {
          if (users.has(detail.user)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: [index, 'user'],
              message: 'Miembro repetido',
            })
          }
          users.add(detail.user)
        })
      }),
  }),
)
