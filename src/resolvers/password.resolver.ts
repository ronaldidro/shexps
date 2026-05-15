import { zodResolver } from "@primevue/forms/resolvers/zod";
import { z } from "zod";

export const passwordResolver = zodResolver(
  z
    .object({
      password: z
        .string({ message: "Contraseña es requerida" })
        .min(8, "Contraseña debe tener mínimo 8 caracteres")
        .refine((value) => /[A-Za-z]/.test(value), {
          message: "Contraseña debe tener al menos una letra",
        })
        .refine((value) => /\d/.test(value), {
          message: "Contraseña debe tener al menos un número",
        }),
      passwordConfirmation: z.string({
        message: "Confirmación de contraseña es requerido",
      }),
    })
    .refine(
      (data) => {
        if (!data.password) return true;
        return data.password === data.passwordConfirmation;
      },
      {
        message: "Las contraseñas no coinciden",
        path: ["passwordConfirmation"],
      },
    ),
);
