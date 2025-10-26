import { z } from "zod"

export const userFormSchema = z.object({
  nom: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  role: z.enum(["admin", "operator", "viewer"], {
    errorMap: () => ({ message: "Please select a valid role" }),
  }),
})

export type UserFormData = z.infer<typeof userFormSchema>

export const userManagementSchema = z.object({
  id: z.string(),
  nom: z.string(),
  email: z.string(),
  role: z.enum(["admin", "operator", "viewer"]),
  dateCreation: z.string(),
  statut: z.enum(["ACTIF", "INACTIF"]),
})

export type UserManagement = z.infer<typeof userManagementSchema>

export const usersResponseSchema = z.array(userManagementSchema)
export type UsersResponse = z.infer<typeof usersResponseSchema>
