import { z } from "zod"

// Bus schema
export const busSchema = z.object({
  id: z.string(),
  busNumber: z.string(),
  status: z.enum(["at_station", "in_route", "maintenance"]),
  currentLocation: z.string().optional(),
  driver: z.string().optional(),
  capacity: z.number(),
  occupancy: z.number(),
  lastUpdate: z.string(),
})

export type Bus = z.infer<typeof busSchema>

// Movement schema
export const movementSchema = z.object({
  id: z.string(),
  busId: z.string(),
  busNumber: z.string(),
  type: z.enum(["entry", "exit"]),
  location: z.string(),
  timestamp: z.string(),
  driver: z.string().optional(),
})

export type Movement = z.infer<typeof movementSchema>

// Payment schema
export const paymentSchema = z.object({
  id: z.string(),
  amount: z.number(),
  currency: z.string(),
  status: z.enum(["completed", "pending", "failed"]),
  timestamp: z.string(),
  description: z.string().optional(),
})

export type Payment = z.infer<typeof paymentSchema>

// Dashboard statistics schema
export const dashboardStatsSchema = z.object({
  totalBuses: z.number(),
  busesAtStation: z.number(),
  busesInRoute: z.number(),
  busesInMaintenance: z.number(),
  activeRoutes: z.number(),
  totalDrivers: z.number(),
  dailyPayments: z.number(),
  systemStatus: z.enum(["online", "offline", "degraded"]),
})

export type DashboardStats = z.infer<typeof dashboardStatsSchema>
