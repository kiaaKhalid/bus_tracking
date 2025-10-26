import { z } from "zod"

// Camera schema for system configuration
export const cameraConfigSchema = z.object({
  id: z.string(),
  emplacement: z.string().min(1, "Location is required"),
  adresseIP: z.string().ip("Invalid IP address"),
  type: z.enum(["ENTREE", "SORTIE", "CHECKPOINT"]).optional(),
  statut: z.enum(["ACTIF", "INACTIF"]).default("ACTIF"),
  dateInstallation: z.string().optional(),
  notes: z.string().optional(),
})

export const cameraFormSchema = cameraConfigSchema.omit({ id: true })

export type CameraConfig = z.infer<typeof cameraConfigSchema>
export type CameraFormData = z.infer<typeof cameraFormSchema>

// Station information schema
export const stationInfoSchema = z.object({
  id: z.string(),
  nom: z.string().min(1, "Station name is required"),
  adresse: z.string().min(1, "Address is required"),
  capacite: z.number().min(1, "Capacity must be at least 1"),
  telephone: z.string().optional(),
  email: z.string().email().optional(),
  responsable: z.string().optional(),
  dateCreation: z.string().optional(),
})

export const stationFormSchema = stationInfoSchema.omit({ id: true, dateCreation: true })

export type StationInfo = z.infer<typeof stationInfoSchema>
export type StationFormData = z.infer<typeof stationFormSchema>

// Response types
export interface CameraListResponse {
  cameras: CameraConfig[]
  total: number
}

export interface StationDetailResponse {
  station: StationInfo
  updatedAt: string
}
