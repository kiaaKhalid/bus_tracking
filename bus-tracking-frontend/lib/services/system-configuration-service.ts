import { apiClient } from "@/lib/api-client"
import type {
  CameraConfig,
  CameraFormData,
  CameraListResponse,
  StationFormData,
  StationDetailResponse,
} from "@/lib/schemas/system-configuration"

export class SystemConfigurationService {
  // Camera operations
  static async getCameras(): Promise<CameraListResponse> {
    return apiClient.get<CameraListResponse>("/cameras")
  }

  static async getCameraById(id: string): Promise<CameraConfig> {
    return apiClient.get<CameraConfig>(`/cameras/${id}`)
  }

  static async createCamera(data: CameraFormData): Promise<CameraConfig> {
    return apiClient.post<CameraConfig>("/cameras", data)
  }

  static async updateCamera(id: string, data: Partial<CameraFormData>): Promise<CameraConfig> {
    return apiClient.put<CameraConfig>(`/cameras/${id}`, data)
  }

  static async deleteCamera(id: string): Promise<{ success: boolean }> {
    return apiClient.delete<{ success: boolean }>(`/cameras/${id}`)
  }

  // Station operations
  static async getStationInfo(): Promise<StationDetailResponse> {
    return apiClient.get<StationDetailResponse>("/station")
  }

  static async updateStationInfo(data: StationFormData): Promise<StationDetailResponse> {
    return apiClient.put<StationDetailResponse>("/station", data)
  }
}
