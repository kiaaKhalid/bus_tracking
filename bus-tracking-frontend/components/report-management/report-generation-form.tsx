"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { reportFormSchema, type ReportFormData } from "@/lib/schemas/report-management"
import { generateReport } from "@/hooks/use-report-management"
import { useToast } from "@/hooks/use-toast"
import { Zap } from "lucide-react"

interface ReportGenerationFormProps {
  onSuccess?: () => void
}

export function ReportGenerationForm({ onSuccess }: ReportGenerationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const form = useForm<ReportFormData>({
    resolver: zodResolver(reportFormSchema),
    defaultValues: {
      typeRapport: "PERFORMANCE",
      dateDebut: "",
      dateFin: "",
    },
  })

  const onSubmit = async (data: ReportFormData) => {
    setIsSubmitting(true)
    try {
      const result = await generateReport(data)

      if (result.success) {
        toast({
          title: "Success",
          description: "Report generation started. This may take a few moments.",
        })
        form.reset()
        onSuccess?.()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to generate report",
          variant: "destructive",
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-blue-600" />
          <div>
            <CardTitle>Generate AI Report</CardTitle>
            <CardDescription>Create a new analysis report for your bus fleet</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Report Type */}
            <FormField
              control={form.control}
              name="typeRapport"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Report Type</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="PERFORMANCE">Performance Analysis</SelectItem>
                      <SelectItem value="AFFLUENCE">Traffic & Occupancy</SelectItem>
                      <SelectItem value="ANOMALIE">Anomaly Detection</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dateDebut"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dateFin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Submit Button */}
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Generating..." : "Generate Report"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
