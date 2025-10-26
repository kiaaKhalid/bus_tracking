import { apiClient } from "@/lib/api-client"
import type { MovementBus, MovementFilters, MovementDetail, PlaqueCorrection } from "@/lib/schemas/operations"

export class OperationsService {
  static async getMovements(
    filters?: MovementFilters,
    limit = 100,
    offset = 0,
  ): Promise<{ data: MovementBus[]; total: number }> {
    const params = new URLSearchParams()

    if (filters?.startDate) params.append("startDate", filters.startDate)
    if (filters?.endDate) params.append("endDate", filters.endDate)
    if (filters?.cameraId) params.append("cameraId", filters.cameraId)
    if (filters?.statut) params.append("statut", filters.statut)
    if (filters?.searchPlaque) params.append("plaque", filters.searchPlaque)

    params.append("limit", limit.toString())
    params.append("offset", offset.toString())
    params.append("sort", "desc")

    return apiClient.get<{ data: MovementBus[]; total: number }>(`/movements?${params.toString()}`)
  }

  static async getMovementById(id: string): Promise<MovementBus> {
    return apiClient.get<MovementBus>(`/movements/${id}`)
  }

  static async getMovementDetail(id: string): Promise<MovementDetail> {
    return apiClient.get<MovementDetail>(`/movements/${id}`)
  }

  static async correctPlaque(correction: PlaqueCorrection): Promise<{ success: boolean; message: string }> {
    return apiClient.post(`/movements/${correction.movementId}/correct-plaque`, {
      correctedPlaque: correction.correctedPlaque,
      reason: correction.reason,
    })
  }

  static async getCameras() {
    return apiClient.get(`/cameras`)
  }
}
