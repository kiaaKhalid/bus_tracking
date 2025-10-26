"use client"

import { useState } from "react"
import { useReports, deleteReport } from "@/hooks/use-report-management"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import type { ReportManagement } from "@/lib/schemas/report-management"
import { FileText, Trash2, Eye, Loader2 } from "lucide-react"

interface ReportsListProps {
  onSelectReport: (report: ReportManagement) => void
}

export function ReportsList({ onSelectReport }: ReportsListProps) {
  const { reports, isLoading, mutate } = useReports()
  const { toast } = useToast()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (reportId: string) => {
    setDeletingId(reportId)
    const result = await deleteReport(reportId)
    if (result.success) {
      toast({
        title: "Success",
        description: "Report deleted successfully",
      })
      mutate()
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to delete report",
        variant: "destructive",
      })
    }
    setDeletingId(null)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETE":
        return "bg-green-100 text-green-800"
      case "EN_COURS":
        return "bg-blue-100 text-blue-800"
      case "ERREUR":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "PERFORMANCE":
        return "Performance Analysis"
      case "AFFLUENCE":
        return "Traffic & Occupancy"
      case "ANOMALIE":
        return "Anomaly Detection"
      default:
        return type
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (isLoading && reports.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Loading reports...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-600" />
          <div>
            <CardTitle>Generated Reports</CardTitle>
            <CardDescription>View and manage your AI-generated reports</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {reports.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No reports generated yet. Create one to get started!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {reports.map((report: ReportManagement) => (
              <div
                key={report.id}
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold">{getTypeLabel(report.typeRapport)}</h3>
                    <Badge className={`${getStatusColor(report.statut)} border-0`}>
                      {report.statut === "EN_COURS" ? (
                        <div className="flex items-center gap-1">
                          <Loader2 className="h-3 w-3 animate-spin" />
                          {report.statut}
                        </div>
                      ) : (
                        report.statut
                      )}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(report.dateGeneration)} • {new Date(report.dateDebut).toLocaleDateString("fr-FR")} to{" "}
                    {new Date(report.dateFin).toLocaleDateString("fr-FR")}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSelectReport(report)}
                    disabled={report.statut !== "COMPLETE"}
                    className="gap-1"
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(report.id)}
                    disabled={deletingId === report.id}
                    className="gap-1 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
