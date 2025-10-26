"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { ReportManagement } from "@/lib/schemas/report-management"
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { X } from "lucide-react"

interface ReportDetailViewProps {
  report: ReportManagement
  onClose: () => void
}

export function ReportDetailView({ report, onClose }: ReportDetailViewProps) {
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
    })
  }

  const chartData = useMemo(() => {
    const data = report.donneesJSON || {}

    if (report.typeRapport === "PERFORMANCE") {
      return data.performanceMetrics || []
    } else if (report.typeRapport === "AFFLUENCE") {
      return data.occupancyData || []
    } else if (report.typeRapport === "ANOMALIE") {
      return data.anomalies || []
    }
    return []
  }, [report])

  const summaryStats = useMemo(() => {
    const data = report.donneesJSON || {}
    return data.summary || {}
  }, [report])

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4 border-b">
          <div>
            <CardTitle>{getTypeLabel(report.typeRapport)}</CardTitle>
            <CardDescription>
              {formatDate(report.dateDebut)} to {formatDate(report.dateFin)}
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          {/* Summary Statistics */}
          {Object.keys(summaryStats).length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(summaryStats).map(([key, value]) => (
                  <div key={key} className="p-4 border border-border rounded-lg">
                    <p className="text-sm text-muted-foreground capitalize">{key.replace(/_/g, " ")}</p>
                    <p className="text-2xl font-bold mt-1">{String(value)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Performance Chart */}
          {report.typeRapport === "PERFORMANCE" && chartData.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
              <ChartContainer
                config={{
                  efficiency: { label: "Efficiency", color: "#3b82f6" },
                  uptime: { label: "Uptime", color: "#10b981" },
                  utilization: { label: "Utilization", color: "#f59e0b" },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line type="monotone" dataKey="efficiency" stroke="#3b82f6" />
                    <Line type="monotone" dataKey="uptime" stroke="#10b981" />
                    <Line type="monotone" dataKey="utilization" stroke="#f59e0b" />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          )}

          {/* Occupancy Chart */}
          {report.typeRapport === "AFFLUENCE" && chartData.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Occupancy Analysis</h3>
              <ChartContainer
                config={{
                  occupancy: { label: "Occupancy Rate", color: "#3b82f6" },
                  capacity: { label: "Capacity", color: "#e5e7eb" },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="route" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="occupancy" fill="#3b82f6" />
                    <Bar dataKey="capacity" fill="#e5e7eb" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          )}

          {/* Anomalies Table */}
          {report.typeRapport === "ANOMALIE" && chartData.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Detected Anomalies</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-2 text-left font-semibold">Bus</th>
                      <th className="px-4 py-2 text-left font-semibold">Type</th>
                      <th className="px-4 py-2 text-left font-semibold">Severity</th>
                      <th className="px-4 py-2 text-left font-semibold">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {chartData.map((anomaly: any, idx: number) => (
                      <tr key={idx} className="hover:bg-muted/50">
                        <td className="px-4 py-2">{anomaly.bus}</td>
                        <td className="px-4 py-2">{anomaly.type}</td>
                        <td className="px-4 py-2">
                          <Badge
                            className={
                              anomaly.severity === "HIGH"
                                ? "bg-red-100 text-red-800"
                                : anomaly.severity === "MEDIUM"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-green-100 text-green-800"
                            }
                          >
                            {anomaly.severity}
                          </Badge>
                        </td>
                        <td className="px-4 py-2 text-muted-foreground">{anomaly.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Raw Data Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Raw Data</h3>
            <div className="bg-muted p-4 rounded-lg overflow-x-auto">
              <pre className="text-xs text-muted-foreground whitespace-pre-wrap break-words">
                {JSON.stringify(report.donneesJSON, null, 2)}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
