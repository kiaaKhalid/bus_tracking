"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { stationFormSchema, type StationFormData, type StationInfo } from "@/lib/schemas/system-configuration"
import { Loader2, Save } from "lucide-react"

interface StationInfoFormProps {
  station: StationInfo | undefined
  isLoading: boolean
  onSubmit: (data: StationFormData) => Promise<void>
}

export function StationInfoForm({ station, isLoading, onSubmit }: StationInfoFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const form = useForm<StationFormData>({
    resolver: zodResolver(stationFormSchema),
    defaultValues: station
      ? {
          nom: station.nom,
          adresse: station.adresse,
          capacite: station.capacite,
          telephone: station.telephone,
          email: station.email,
          responsable: station.responsable,
        }
      : {
          nom: "",
          adresse: "",
          capacite: 0,
          telephone: "",
          email: "",
          responsable: "",
        },
    values: station
      ? {
          nom: station.nom,
          adresse: station.adresse,
          capacite: station.capacite,
          telephone: station.telephone || "",
          email: station.email || "",
          responsable: station.responsable || "",
        }
      : undefined,
  })

  const handleSubmit = async (data: StationFormData) => {
    try {
      setError(null)
      setSuccess(false)
      await onSubmit(data)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Station Information</CardTitle>
        <CardDescription>Update the basic information about your bus station</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="nom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Station Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Central Bus Station" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="capacite"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacity (Max Buses)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="50"
                        {...field}
                        onChange={(e) => field.onChange(Number.parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="adresse"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Full address of the station" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="telephone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 (555) 000-0000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="info@station.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="responsable"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Responsible Person</FormLabel>
                  <FormControl>
                    <Input placeholder="Name of the station manager" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
            {success && (
              <div className="rounded-md bg-green-50 p-3 text-sm text-green-700">
                Station information updated successfully
              </div>
            )}

            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
