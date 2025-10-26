"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { ReportGenerationForm } from "@/components/report-management/report-generation-form"
import { ReportsList } from "@/components/report-management/reports-list"
import { ReportDetailView } from "@/components/report-management/report-detail-view"
import { useReports } from "@/hooks/use-report-management"
import type { ReportManagement } from "@/lib/schemas/report-management"

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState<ReportManagement | null>(null)
  const { mutate } = useReports()

  const handleReportGenerated = () => {
    mutate()
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">AI Reports</h1>
          <p className="text-muted-foreground">Generate and analyze AI-powered reports for your fleet</p>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Generation Form */}
          <div className="lg:col-span-1">
            <ReportGenerationForm onSuccess={handleReportGenerated} />
          </div>

          {/* Reports List */}
          <div className="lg:col-span-2">
            <ReportsList onSelectReport={setSelectedReport} />
          </div>
        </div>
      </div>

      {/* Report Detail Modal */}
      {selectedReport && <ReportDetailView report={selectedReport} onClose={() => setSelectedReport(null)} />}
    </MainLayout>
  )
}
