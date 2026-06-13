import { zodResolver } from '@primevue/forms/resolvers/zod'
import z from 'zod'

export const filterResolver = zodResolver(
  z
    .object({
      group: z.string().nullable(),
      user: z.string().nullable(),
      range: z.preprocess((val) => {
        if (!Array.isArray(val)) return []
        const [start, end] = val as Date[]
        if (end) end.setHours(23, 59, 59, 999)
        return [start?.toISOString(), end?.toISOString()]
      }, z.any().optional()),
    })
    .refine(
      (data) => {
        if (!data.range?.length) return true
        const [start, end] = data.range
        return start && end
      },
      { message: 'Debe seleccionar ambas fechas', path: ['range'] },
    )
    .transform(({ range, ...rest }) => ({
      ...rest,
      startDate: range[0],
      endDate: range[1],
    })),
)
