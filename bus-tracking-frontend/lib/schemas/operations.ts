import { z } from "zod"

export const cameraSchema = z.object({
  id: z.string(),
  name: z.string(),
  location: z.string(),
  type: z.enum(["entry", "exit", "checkpoint"]),
})

export type Camera = z.infer<typeof cameraSchema>

export const movementBusSchema = z.object({
  id: z.string(),
  busId: z.string(),
  plaqueDetectee: z.string(),
  heureEntree: z.string().nullable(),
  heureSortie: z.string().nullable(),
  statut: z.enum(["EN_RETARD", "A_L_HEURE", "EN_AVANCE"]),
  camera: cameraSchema,
  driver: z.string().optional(),
  occupancy: z.number().optional(),
  confidence: z.number(), // ANPR confidence score 0-100
})

export type MovementBus = z.infer<typeof movementBusSchema>

export const movementFiltersSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  cameraId: z.string().optional(),
  statut: z.enum(["EN_RETARD", "A_L_HEURE", "EN_AVANCE"]).optional(),
  searchPlaque: z.string().optional(),
})

export type MovementFilters = z.infer<typeof movementFiltersSchema>

export const movementDetailSchema = movementBusSchema.extend({
  urlImagePlaque: z.string().url(),
  busInfo: z
    .object({
      id: z.string(),
      plaque: z.string(),
      marque: z.string(),
      modele: z.string(),
      driver: z.string(),
    })
    .optional(),
  scheduleInfo: z
    .object({
      routeId: z.string(),
      routeName: z.string(),
      scheduledTime: z.string(),
      expectedArrival: z.string(),
    })
    .optional(),
  correctionHistory: z
    .array(
      z.object({
        id: z.string(),
        originalPlaque: z.string(),
        correctedPlaque: z.string(),
        correctedBy: z.string(),
        correctedAt: z.string(),
      }),
    )
    .optional(),
})

export type MovementDetail = z.infer<typeof movementDetailSchema>

export const plaqueCorrectionsSchema = z.object({
  movementId: z.string(),
  correctedPlaque: z.string(),
  reason: z.string().optional(),
})

export type PlaqueCorrection = z.infer<typeof plaqueCorrectionsSchema>
