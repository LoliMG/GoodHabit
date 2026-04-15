import { z } from "zod";

// Lista de dominios de correos temporales comunes
const DISPOSABLE_DOMAINS = [
    "mailinator.com",
    "yopmail.com",
    "10minutemail.com",
    "temp-mail.org",
    "guerrillamail.com",
    "trashmail.com",
    "emailondeck.com",
    "maildrop.cc",
    "getnada.com",
    "mohmal.com",
    "dispostable.com"
];

export const registerSchema = z.object({
    name: z.string()
            .min(3, "Nombre muy corto")
            .max(50, "Nombre debe tener menos de 50 caracteres"),
    email: z.string()
            .email("Email no válido")
            .refine((val) => {
                const domain = val.split('@')[1]?.toLowerCase();
                return !DISPOSABLE_DOMAINS.includes(domain);
            }, {
                message: "No se permiten correos temporales o desechables"
            }),
    password: z
                .string()
                .regex(
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
                    "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número"
                )
});
