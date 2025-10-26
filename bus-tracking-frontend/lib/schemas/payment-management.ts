import { z } from "zod"

// Payment management schema
export const paymentManagementSchema = z.object({
  id: z.string(),
  busId: z.string(),
  busPlaque: z.string(),
  montant: z.number().min(0, "Amount must be positive"),
  datePaiement: z.string(),
  methode: z.enum(["QR", "CB", "ESPECES", "VIREMENT"], {
    errorMap: () => ({ message: "Invalid payment method" }),
  }),
  statut: z.enum(["PAYE", "EN_ATTENTE"], {
    errorMap: () => ({ message: "Invalid status" }),
  }),
  reference: z.string().optional(),
  notes: z.string().optional(),
})

export type PaymentManagement = z.infer<typeof paymentManagementSchema>

// Response types
export interface PaymentListResponse {
  payments: PaymentManagement[]
  total: number
  page: number
  pageSize: number
}

export interface PaymentDetailResponse {
  payment: PaymentManagement
  createdAt: string
  updatedAt: string
}
