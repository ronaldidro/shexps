import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";

export const loginSchema = toTypedSchema(
  z.object({
    email: z.string().email("Email inválido").min(1, "El email es obligatorio"),
    password: z.string().min(1, "La contraseña es obligatoria"),
  }),
);
