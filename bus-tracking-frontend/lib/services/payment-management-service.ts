import { apiClient } from "@/lib/api-client"
import type { PaymentManagement, PaymentListResponse, PaymentDetailResponse } from "@/lib/schemas/payment-management"

export interface PaymentFilters {
  page?: number
  pageSize?: number
  statut?: string
  busId?: string
  dateFrom?: string
  dateTo?: string
}

export class PaymentManagementService {
  static async getPayments(filters: PaymentFilters = {}): Promise<PaymentListResponse> {
    const params = new URLSearchParams()
    if (filters.page) params.append("page", filters.page.toString())
    if (filters.pageSize) params.append("pageSize", filters.pageSize.toString())
    if (filters.statut) params.append("statut", filters.statut)
    if (filters.busId) params.append("busId", filters.busId)
    if (filters.dateFrom) params.append("dateFrom", filters.dateFrom)
    if (filters.dateTo) params.append("dateTo", filters.dateTo)

    return apiClient.get<PaymentListResponse>(`/payments?${params.toString()}`)
  }

  static async getPaymentById(id: string): Promise<PaymentDetailResponse> {
    return apiClient.get<PaymentDetailResponse>(`/payments/${id}`)
  }

  static async updatePaymentStatus(id: string, statut: "PAYE" | "EN_ATTENTE"): Promise<PaymentDetailResponse> {
    return apiClient.patch<PaymentDetailResponse>(`/payments/${id}`, { statut })
  }

  static async searchPayments(query: string): Promise<PaymentManagement[]> {
    return apiClient.get<PaymentManagement[]>(`/payments/search?q=${encodeURIComponent(query)}`)
  }
}
