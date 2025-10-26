import { apiClient } from "@/lib/api-client"
import type { BusWithLocation, BusLocationUpdate } from "@/lib/schemas/tracking"

export class TrackingService {
  static async getBusesWithLocations(): Promise<BusWithLocation[]> {
    return apiClient.get<BusWithLocation[]>("/buses/locations")
  }

  static async getBusLocation(busId: string): Promise<BusWithLocation> {
    return apiClient.get<BusWithLocation>(`/buses/${busId}/location`)
  }

  static async subscribeToLocationUpdates(callback: (update: BusLocationUpdate) => void): Promise<() => void> {
    // Polling-based implementation (can be replaced with WebSocket)
    const interval = setInterval(async () => {
      try {
        const buses = await this.getBusesWithLocations()
        buses.forEach((bus) => {
          callback({
            busId: bus.id,
            busNumber: bus.busNumber,
            location: bus.location,
            status: bus.status,
          })
        })
      } catch (error) {
        console.error("[v0] Error fetching location updates:", error)
      }
    }, 5000) // Update every 5 seconds

    // Return unsubscribe function
    return () => clearInterval(interval)
  }
}
