import { apiClient } from "@/lib/api-client"
import type {
  ScheduleManagement,
  ScheduleFormData,
  ScheduleListResponse,
  ScheduleDetailResponse,
} from "@/lib/schemas/schedule-management"

export class ScheduleManagementService {
  static async getSchedules(page = 1, pageSize = 50): Promise<ScheduleListResponse> {
    return apiClient.get<ScheduleListResponse>(`/schedules?page=${page}&pageSize=${pageSize}`)
  }

  static async getScheduleById(id: string): Promise<ScheduleDetailResponse> {
    return apiClient.get<ScheduleDetailResponse>(`/schedules/${id}`)
  }

  static async createSchedule(data: ScheduleFormData): Promise<ScheduleDetailResponse> {
    return apiClient.post<ScheduleDetailResponse>("/schedules", data)
  }

  static async updateSchedule(id: string, data: ScheduleFormData): Promise<ScheduleDetailResponse> {
    return apiClient.put<ScheduleDetailResponse>(`/schedules/${id}`, data)
  }

  static async deleteSchedule(id: string): Promise<{ success: boolean }> {
    return apiClient.delete<{ success: boolean }>(`/schedules/${id}`)
  }

  static async searchSchedules(query: string): Promise<ScheduleManagement[]> {
    return apiClient.get<ScheduleManagement[]>(`/schedules/search?q=${encodeURIComponent(query)}`)
  }
}
