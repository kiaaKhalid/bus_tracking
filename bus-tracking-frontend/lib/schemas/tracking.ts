import { z } from "zod"

// GPS Location schema
export const gpsLocationSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  accuracy: z.number().optional(),
  timestamp: z.string(),
})

export type GPSLocation = z.infer<typeof gpsLocationSchema>

// Bus with GPS location
export const busWithLocationSchema = z.object({
  id: z.string(),
  busNumber: z.string(),
  status: z.enum(["at_station", "in_route", "maintenance"]),
  location: gpsLocationSchema,
  driver: z.string().optional(),
  capacity: z.number(),
  occupancy: z.number(),
  lastUpdate: z.string(),
})

export type BusWithLocation = z.infer<typeof busWithLocationSchema>

// Bus location update event
export const busLocationUpdateSchema = z.object({
  busId: z.string(),
  busNumber: z.string(),
  location: gpsLocationSchema,
  status: z.enum(["at_station", "in_route", "maintenance"]),
})

export type BusLocationUpdate = z.infer<typeof busLocationUpdateSchema>
