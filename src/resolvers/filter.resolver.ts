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
    .transform(({ group, user, range }) => {
      const result: Record<string, unknown> = {}
      const [startDate, endDate] = range

      if (group) result.group = group
      if (user) result.user = user
      if (startDate) result.startDate = startDate
      if (endDate) result.endDate = endDate

      return Object.keys(result).length ? result : null
    }),
)
