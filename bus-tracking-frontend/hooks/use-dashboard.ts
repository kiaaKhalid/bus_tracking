"use client"

import useSWR from "swr"
import { DashboardService } from "@/lib/services/dashboard-service"
import type { DashboardStats, Bus, Movement } from "@/lib/schemas/dashboard"

export function useDashboardStats() {
  const { data, error, isLoading, mutate } = useSWR<DashboardStats>(
    "dashboard-stats",
    () => DashboardService.getStats(),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 60000, // 1 minute
      focusThrottleInterval: 300000, // 5 minutes
    },
  )

  return {
    stats: data,
    isLoading,
    error,
    mutate,
  }
}

export function useBuses() {
  const { data, error, isLoading, mutate } = useSWR<Bus[]>("buses", () => DashboardService.getBuses(), {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 60000,
  })

  return {
    buses: data || [],
    isLoading,
    error,
    mutate,
  }
}

export function useRecentMovements(limit = 5) {
  const { data, error, isLoading, mutate } = useSWR<Movement[]>(
    `recent-movements-${limit}`,
    () => DashboardService.getRecentMovements(limit),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 30000, // 30 seconds for live feed
      focusThrottleInterval: 60000, // 1 minute
    },
  )

  return {
    movements: data || [],
    isLoading,
    error,
    mutate,
  }
}

export function useDailyPayments() {
  const { data, error, isLoading, mutate } = useSWR<number>(
    "daily-payments",
    () => DashboardService.getTotalDailyPayments(),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 60000,
    },
  )

  return {
    totalPayments: data || 0,
    isLoading,
    error,
    mutate,
  }
}
