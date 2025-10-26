import useSWR from "swr"
import { TrackingService } from "@/lib/services/tracking-service"
import type { BusWithLocation } from "@/lib/schemas/tracking"

export function useBusesWithLocations() {
  const { data, error, isLoading, mutate } = useSWR<BusWithLocation[]>(
    "/buses/locations",
    () => TrackingService.getBusesWithLocations(),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 5000,
      focusThrottleInterval: 30000,
    },
  )

  return {
    buses: data || [],
    isLoading,
    error,
    mutate,
  }
}

export function useBusLocation(busId: string) {
  const { data, error, isLoading, mutate } = useSWR<BusWithLocation>(
    busId ? `/buses/${busId}/location` : null,
    () => (busId ? TrackingService.getBusLocation(busId) : Promise.resolve(null as any)),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 5000,
    },
  )

  return {
    bus: data,
    isLoading,
    error,
    mutate,
  }
}
