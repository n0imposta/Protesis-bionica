import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Ingresa un email valido"),
  password: z.string().min(8, "La clave debe tener al menos 8 caracteres"),
});

export const registerSchema = loginSchema.extend({
  fullName: z.string().min(2, "Ingresa tu nombre"),
  career: z.string().min(2, "Ingresa tu carrera o especialidad"),
  role: z.enum(["admin", "researcher", "engineer", "medical_specialist", "student"]),
});

export const resetPasswordSchema = z.object({
  email: z.string().email("Ingresa un email valido"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
