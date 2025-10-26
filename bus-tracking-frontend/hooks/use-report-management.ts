import useSWR from "swr"
import { reportManagementService } from "@/lib/services/report-management-service"
import type { ReportFormData, ReportManagement } from "@/lib/schemas/report-management"

export function useReports() {
  const { data, error, isLoading, mutate } = useSWR("/api/reports", async () => {
    const result = await reportManagementService.getReports()
    return result.success ? result.data || [] : []
  })

  return {
    reports: (data as ReportManagement[]) || [],
    isLoading,
    error,
    mutate,
  }
}

export async function generateReport(data: ReportFormData) {
  return await reportManagementService.generateReport(data)
}

export async function deleteReport(reportId: string) {
  return await reportManagementService.deleteReport(reportId)
}
