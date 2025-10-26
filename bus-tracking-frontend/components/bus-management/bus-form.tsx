"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { busFormSchema, type BusFormData, type BusManagement } from "@/lib/schemas/bus-management"
import { createBus, updateBus } from "@/hooks/use-bus-management"
import { useToast } from "@/hooks/use-toast"

interface BusFormProps {
  bus?: BusManagement
  onSuccess?: () => void
  onCancel?: () => void
}

export function BusForm({ bus, onSuccess, onCancel }: BusFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const form = useForm<BusFormData>({
    resolver: zodResolver(busFormSchema),
    defaultValues: bus
      ? {
          plaqueImmatriculation: bus.plaqueImmatriculation,
          compagnie: bus.compagnie,
          statut: bus.statut,
          capacite: bus.capacite,
          conducteur: bus.conducteur || "",
          dateAcquisition: bus.dateAcquisition || "",
          kilometrage: bus.kilometrage,
          derniereRevision: bus.derniereRevision || "",
          notes: bus.notes || "",
        }
      : {
          plaqueImmatriculation: "",
          compagnie: "",
          statut: "EN_STATION",
          capacite: 50,
          conducteur: "",
          dateAcquisition: "",
          kilometrage: 0,
          derniereRevision: "",
          notes: "",
        },
  })

  const onSubmit = async (data: BusFormData) => {
    setIsSubmitting(true)
    try {
      const result = bus ? await updateBus(bus.id, data) : await createBus(data)

      if (result.success) {
        toast({
          title: "Success",
          description: bus ? "Bus updated successfully" : "Bus created successfully",
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
        {/* License Plate */}
        <FormField
          control={form.control}
          name="plaqueImmatriculation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>License Plate</FormLabel>
              <FormControl>
                <Input placeholder="e.g., ABC-1234" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Company */}
        <FormField
          control={form.control}
          name="compagnie"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company</FormLabel>
              <FormControl>
                <Input placeholder="e.g., TransportCo" {...field} />
              </FormControl>
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
                  <SelectItem value="EN_STATION">At Station</SelectItem>
                  <SelectItem value="EN_ROUTE">In Route</SelectItem>
                  <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Capacity */}
        <FormField
          control={form.control}
          name="capacite"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Capacity (seats)</FormLabel>
              <FormControl>
                <Input type="number" min="1" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Driver */}
        <FormField
          control={form.control}
          name="conducteur"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Driver (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Driver name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Acquisition Date */}
        <FormField
          control={form.control}
          name="dateAcquisition"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Acquisition Date (Optional)</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Mileage */}
        <FormField
          control={form.control}
          name="kilometrage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mileage (km)</FormLabel>
              <FormControl>
                <Input type="number" min="0" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Last Revision */}
        <FormField
          control={form.control}
          name="derniereRevision"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Revision (Optional)</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
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
                  placeholder="Additional notes about the bus"
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
            {isSubmitting ? "Saving..." : bus ? "Update Bus" : "Create Bus"}
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
