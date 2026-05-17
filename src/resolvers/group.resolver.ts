import { zodResolver } from "@primevue/forms/resolvers/zod";
import { z } from "zod";

export const groupResolver = zodResolver(
  z.object({
    name: z.string().min(1, "Nombre es requerido"),
    members: z
      .array(z.string().uuid("Miembro inválido"))
      .min(1, "Debe seleccionar al menos un miembro"),
  }),
);
