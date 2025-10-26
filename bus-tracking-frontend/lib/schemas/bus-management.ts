import { z } from "zod"

// Bus management schema with all fields needed for CRUD
export const busManagementSchema = z.object({
  id: z.string(),
  plaqueImmatriculation: z.string().min(1, "License plate is required"),
  compagnie: z.string().min(1, "Company is required"),
  statut: z.enum(["EN_STATION", "EN_ROUTE", "MAINTENANCE"], {
    errorMap: () => ({ message: "Invalid status" }),
  }),
  capacite: z.number().min(1, "Capacity must be at least 1"),
  conducteur: z.string().optional(),
  dateAcquisition: z.string().optional(),
  kilometrage: z.number().default(0),
  derniereRevision: z.string().optional(),
  notes: z.string().optional(),
})

export const busFormSchema = busManagementSchema.omit({ id: true })

export type BusManagement = z.infer<typeof busManagementSchema>
export type BusFormData = z.infer<typeof busFormSchema>

// Response types
export interface BusListResponse {
  buses: BusManagement[]
  total: number
  page: number
  pageSize: number
}

export interface BusDetailResponse {
  bus: BusManagement
  createdAt: string
  updatedAt: string
}
