"use client"

import { useState, useCallback } from "react"
import { MapContainer, TileLayer, ZoomControl } from "react-leaflet"
import L from "leaflet"
import { MapMarker } from "./map-marker"
import { useBusesWithLocations } from "@/hooks/use-tracking"
import type { BusWithLocation } from "@/lib/schemas/tracking"
import { Card } from "@/components/ui/card"

// Fix Leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
})

interface GPSMapProps {
  onBusSelect?: (bus: BusWithLocation) => void
  center?: [number, number]
  zoom?: number
}

export function GPSMap({ onBusSelect, center = [48.8566, 2.3522], zoom = 12 }: GPSMapProps) {
  const { buses, isLoading, error } = useBusesWithLocations()
  const [selectedBus, setSelectedBus] = useState<BusWithLocation | null>(null)

  const handleBusSelect = useCallback(
    (bus: BusWithLocation) => {
      setSelectedBus(bus)
      onBusSelect?.(bus)
    },
    [onBusSelect],
  )

  if (error) {
    return (
      <Card className="p-6 bg-red-50 border-red-200">
        <p className="text-red-800">Error loading map data: {error.message}</p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="relative h-[600px] rounded-lg overflow-hidden border border-border">
        {isLoading && (
          <div className="absolute inset-0 bg-black/10 flex items-center justify-center z-10">
            <div className="bg-white px-4 py-2 rounded-lg">Loading map...</div>
          </div>
        )}
        <MapContainer
          center={center}
          zoom={zoom}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ZoomControl position="topright" />

          {/* Render markers for all buses */}
          {buses.map((bus) => (
            <MapMarker key={bus.id} bus={bus} onSelect={handleBusSelect} />
          ))}
        </MapContainer>
      </div>

      {/* Bus count and status summary */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Total Buses</p>
          <p className="text-2xl font-bold">{buses.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">In Route</p>
          <p className="text-2xl font-bold text-green-600">{buses.filter((b) => b.status === "in_route").length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">At Station</p>
          <p className="text-2xl font-bold text-blue-600">{buses.filter((b) => b.status === "at_station").length}</p>
        </Card>
      </div>

      {/* Selected bus details */}
      {selectedBus && (
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold">Bus {selectedBus.busNumber}</h3>
              <p className="text-sm text-gray-600">
                {selectedBus.location.latitude.toFixed(4)}, {selectedBus.location.longitude.toFixed(4)}
              </p>
            </div>
            <button onClick={() => setSelectedBus(null)} className="text-gray-400 hover:text-gray-600">
              ✕
            </button>
          </div>
        </Card>
      )}
    </div>
  )
}
