"use client"

import useSWR from "swr"
import { OperationsService } from "@/lib/services/operations-service"
import type { MovementBus, MovementFilters, MovementDetail, PlaqueCorrection } from "@/lib/schemas/operations"
import { useState } from "react"

export function useMovements(filters?: MovementFilters, limit = 100, offset = 0) {
  const filterKey = filters ? JSON.stringify(filters) : "default"
  const { data, error, isLoading, mutate } = useSWR<{ data: MovementBus[]; total: number }>(
    `movements-${filterKey}-${limit}-${offset}`,
    () => OperationsService.getMovements(filters, limit, offset),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 30000, // 30 seconds
      focusThrottleInterval: 60000, // 1 minute
    },
  )

  return {
    movements: data?.data || [],
    total: data?.total || 0,
    isLoading,
    error,
    mutate,
  }
}

export function useCameras() {
  const { data, error, isLoading } = useSWR("cameras", () => OperationsService.getCameras(), {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 300000, // 5 minutes
  })

  return {
    cameras: data || [],
    isLoading,
    error,
  }
}

export function useMovementDetail(id: string) {
  const { data, error, isLoading, mutate } = useSWR<MovementDetail>(
    id ? `movement-detail-${id}` : null,
    () => (id ? OperationsService.getMovementDetail(id) : Promise.reject("No ID provided")),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 60000, // 1 minute
    },
  )

  return {
    movement: data,
    isLoading,
    error,
    mutate,
  }
}

export function usePlaqueCorrection() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submitCorrection = async (correction: PlaqueCorrection) => {
    setIsSubmitting(true)
    setError(null)
    try {
      const result = await OperationsService.correctPlaque(correction)
      setIsSubmitting(false)
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to submit correction"
      setError(errorMessage)
      setIsSubmitting(false)
      throw err
    }
  }

  return {
    submitCorrection,
    isSubmitting,
    error,
  }
}
