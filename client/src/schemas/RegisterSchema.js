import { z } from "zod";

export const registerSchema = z.object({
    name: z.string()
            .min(3, "Nombre muy corto")
            .max(50, "Nombre debe tener menos de 50 caracteres"),
    email: z.string().email("Email no válido"),
    password: z
                .string()
                .regex(
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
                    "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo"
                )
});
