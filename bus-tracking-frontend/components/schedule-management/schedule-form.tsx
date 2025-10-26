"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { scheduleFormSchema, type ScheduleFormData, type ScheduleManagement } from "@/lib/schemas/schedule-management"
import { createSchedule, updateSchedule } from "@/hooks/use-schedule-management"
import { useBuses } from "@/hooks/use-bus-management"
import { useToast } from "@/hooks/use-toast"

interface ScheduleFormProps {
  schedule?: ScheduleManagement
  onSuccess?: () => void
  onCancel?: () => void
}

const DAYS_OF_WEEK = [
  { value: "LUNDI", label: "Monday" },
  { value: "MARDI", label: "Tuesday" },
  { value: "MERCREDI", label: "Wednesday" },
  { value: "JEUDI", label: "Thursday" },
  { value: "VENDREDI", label: "Friday" },
  { value: "SAMEDI", label: "Saturday" },
  { value: "DIMANCHE", label: "Sunday" },
]

export function ScheduleForm({ schedule, onSuccess, onCancel }: ScheduleFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const { buses } = useBuses()

  const form = useForm<ScheduleFormData>({
    resolver: zodResolver(scheduleFormSchema),
    defaultValues: schedule
      ? {
          ligne: schedule.ligne,
          heureDepartPrevue: schedule.heureDepartPrevue,
          heureArriveePrevue: schedule.heureArriveePrevue,
          busId: schedule.busId,
          jours: schedule.jours,
          statut: schedule.statut,
          notes: schedule.notes || "",
        }
      : {
          ligne: "",
          heureDepartPrevue: "",
          heureArriveePrevue: "",
          busId: "",
          jours: [],
          statut: "ACTIF",
          notes: "",
        },
  })

  const onSubmit = async (data: ScheduleFormData) => {
    setIsSubmitting(true)
    try {
      const result = schedule ? await updateSchedule(schedule.id, data) : await createSchedule(data)

      if (result.success) {
        toast({
          title: "Success",
          description: schedule ? "Schedule updated successfully" : "Schedule created successfully",
        })
        onSuccess?.()
      } else {
        toast({
          title: "Error",
          description: result.error || "An error occurred",
          variant: "destructive",
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Route/Line */}
        <FormField
          control={form.control}
          name="ligne"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Route/Line</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Line 1, Route A" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Bus Selection */}
        <FormField
          control={form.control}
          name="busId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bus</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a bus" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {buses.map((bus) => (
                    <SelectItem key={bus.id} value={bus.id}>
                      {bus.plaqueImmatriculation} - {bus.compagnie}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Scheduled Departure Time */}
        <FormField
          control={form.control}
          name="heureDepartPrevue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Scheduled Departure Time</FormLabel>
              <FormControl>
                <Input type="time" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Scheduled Arrival Time */}
        <FormField
          control={form.control}
          name="heureArriveePrevue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Scheduled Arrival Time</FormLabel>
              <FormControl>
                <Input type="time" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Days of Week */}
        <FormField
          control={form.control}
          name="jours"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Days of Operation</FormLabel>
              <div className="grid grid-cols-2 gap-3">
                {DAYS_OF_WEEK.map((day) => (
                  <div key={day.value} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={day.value}
                      checked={field.value?.includes(day.value as any)}
                      onChange={(e) => {
                        const newDays = e.target.checked
                          ? [...(field.value || []), day.value]
                          : field.value?.filter((d) => d !== day.value) || []
                        field.onChange(newDays)
                      }}
                      className="rounded border-input"
                    />
                    <label htmlFor={day.value} className="text-sm cursor-pointer">
                      {day.label}
                    </label>
                  </div>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Status */}
        <FormField
          control={form.control}
          name="statut"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="ACTIF">Active</SelectItem>
                  <SelectItem value="INACTIF">Inactive</SelectItem>
                  <SelectItem value="SUSPENDU">Suspended</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Notes */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl>
                <textarea
                  placeholder="Additional notes about the schedule"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Form Actions */}
        <div className="flex gap-3">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : schedule ? "Update Schedule" : "Create Schedule"}
          </Button>
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Form>
  )
}
