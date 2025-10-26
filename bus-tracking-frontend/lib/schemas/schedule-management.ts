import { z } from "zod"

// Schedule management schema with all fields needed for CRUD
export const scheduleManagementSchema = z.object({
  id: z.string(),
  ligne: z.string().min(1, "Route/Line is required"),
  heureDepartPrevue: z.string().min(1, "Scheduled departure time is required"),
  heureArriveePrevue: z.string().min(1, "Scheduled arrival time is required"),
  busId: z.string().min(1, "Bus is required"),
  jours: z
    .array(z.enum(["LUNDI", "MARDI", "MERCREDI", "JEUDI", "VENDREDI", "SAMEDI", "DIMANCHE"]))
    .min(1, "At least one day is required"),
  statut: z.enum(["ACTIF", "INACTIF", "SUSPENDU"], {
    errorMap: () => ({ message: "Invalid status" }),
  }),
  notes: z.string().optional(),
})

export const scheduleFormSchema = scheduleManagementSchema.omit({ id: true })

export type ScheduleManagement = z.infer<typeof scheduleManagementSchema>
export type ScheduleFormData = z.infer<typeof scheduleFormSchema>

// Response types
export interface ScheduleListResponse {
  schedules: ScheduleManagement[]
  total: number
  page: number
  pageSize: number
}

export interface ScheduleDetailResponse {
  schedule: ScheduleManagement
  createdAt: string
  updatedAt: string
}
