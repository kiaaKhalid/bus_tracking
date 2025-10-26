import { apiClient } from "@/lib/api-client"
import type { BusManagement, BusFormData, BusListResponse, BusDetailResponse } from "@/lib/schemas/bus-management"

export class BusManagementService {
  static async getBuses(page = 1, pageSize = 50): Promise<BusListResponse> {
    return apiClient.get<BusListResponse>(`/buses?page=${page}&pageSize=${pageSize}`)
  }

  static async getBusById(id: string): Promise<BusDetailResponse> {
    return apiClient.get<BusDetailResponse>(`/buses/${id}`)
  }

  static async createBus(data: BusFormData): Promise<BusDetailResponse> {
    return apiClient.post<BusDetailResponse>("/buses", data)
  }

  static async updateBus(id: string, data: BusFormData): Promise<BusDetailResponse> {
    return apiClient.put<BusDetailResponse>(`/buses/${id}`, data)
  }

  static async deleteBus(id: string): Promise<{ success: boolean }> {
    return apiClient.delete<{ success: boolean }>(`/buses/${id}`)
  }

  static async searchBuses(query: string): Promise<BusManagement[]> {
    return apiClient.get<BusManagement[]>(`/buses/search?q=${encodeURIComponent(query)}`)
  }
}
