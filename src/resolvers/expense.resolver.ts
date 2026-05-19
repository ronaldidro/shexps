import { zodResolver } from "@primevue/forms/resolvers/zod";
import z from "zod";

export const expenseResolver = zodResolver(
  z.object({
    date: z.preprocess(
      (val) => {
        if (val === "" || val === null) return null;
        return new Date(val);
      },
      z.union([
        z.date(),
        z
          .null()
          .refine((val) => val !== null, { message: "Fecha es requerida" }),
      ]),
    ),
    description: z.string().min(1, "Descripción es requerido"),
    amount: z
      .union([
        z.number().gt(0, { message: "Monto debe ser mayor que 0" }),
        z.literal(null),
      ])
      .refine((val) => val !== null, { message: "Monto es requerido" }),
  }),
);
