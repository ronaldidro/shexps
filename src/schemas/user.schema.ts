import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";

export const updateUserSchema = toTypedSchema(
  z
    .object({
      firstName: z.string().min(1, "El nombre es obligatorio"),
      lastName: z.string().min(1, "El apellido es obligatorio"),
      email: z.string().email("Email inválido"),
      password: z.string().optional(),
      passwordConfirmation: z.string().optional(),
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
