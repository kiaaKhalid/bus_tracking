import { apiClient } from "@/lib/api-client"
import type { ReportFormData, ReportResponse, ReportsListResponse } from "@/lib/schemas/report-management"

export const reportManagementService = {
  async getReports(): Promise<ReportsListResponse> {
    try {
      const response = await apiClient.get("/api/reports")
      return response
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch reports",
      }
    }
  },

  async generateReport(data: ReportFormData): Promise<ReportResponse> {
    try {
      const response = await apiClient.post("/api/reports/generate", data)
      return response
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to generate report",
      }
    }
  },

  async getReportDetail(reportId: string): Promise<ReportResponse> {
    try {
      const response = await apiClient.get(`/api/reports/${reportId}`)
      return response
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch report",
      }
    }
  },

  async deleteReport(reportId: string): Promise<ReportResponse> {
    try {
      const response = await apiClient.delete(`/api/reports/${reportId}`)
      return response
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to delete report",
      }
    }
  },
}
