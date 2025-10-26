import { z } from "zod"

export const reportTypeEnum = z.enum(["PERFORMANCE", "AFFLUENCE", "ANOMALIE"])
export type ReportType = z.infer<typeof reportTypeEnum>

export const reportStatusEnum = z.enum(["EN_COURS", "COMPLETE", "ERREUR"])
export type ReportStatus = z.infer<typeof reportStatusEnum>

export const reportFormSchema = z.object({
  typeRapport: reportTypeEnum,
  dateDebut: z.string().min(1, "Start date is required"),
  dateFin: z.string().min(1, "End date is required"),
})

export type ReportFormData = z.infer<typeof reportFormSchema>

export interface ReportManagement {
  id: string
  typeRapport: ReportType
  dateDebut: string
  dateFin: string
  statut: ReportStatus
  dateGeneration: string
  donneesJSON: Record<string, any>
  createdAt: string
  updatedAt: string
}

export interface ReportResponse {
  success: boolean
  data?: ReportManagement
  error?: string
}

export interface ReportsListResponse {
  success: boolean
  data?: ReportManagement[]
  error?: string
}
