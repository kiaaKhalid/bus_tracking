import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Email invalide").min(1, "Email requis"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
})

export type LoginFormData = z.infer<typeof loginSchema>

export const authResponseSchema = z.object({
  token: z.string(),
  user: z.object({
    id: z.string(),
    email: z.string(),
    role: z.enum(["admin", "operator", "viewer"]),
  }),
})

export type AuthResponse = z.infer<typeof authResponseSchema>

export const npmsignupSchema = z
  .object({
    name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    email: z.string().email("Email invalide").min(1, "Email requis"),
    password: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères")
      .regex(/[A-Z]/, "Doit contenir une majuscule")
      .regex(/[0-9]/, "Doit contenir un chiffre")
      .regex(/[!@#$%^&*]/, "Doit contenir un caractère spécial"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  })

export type SignupFormData = z.infer<typeof signupSchema>

export const forgotPasswordSchema = z.object({
  email: z.string().email("Email invalide").min(1, "Email requis"),
})

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

export const verifyOtpSchema = z.object({
  otp: z
    .string()
    .length(6, "Le code OTP doit contenir 6 chiffres")
    .regex(/^\d+$/, "Le code OTP doit contenir uniquement des chiffres"),
})

export type VerifyOtpFormData = z.infer<typeof verifyOtpSchema>

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères")
      .regex(/[A-Z]/, "Doit contenir une majuscule")
      .regex(/[0-9]/, "Doit contenir un chiffre")
      .regex(/[!@#$%^&*]/, "Doit contenir un caractère spécial"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  })

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>
