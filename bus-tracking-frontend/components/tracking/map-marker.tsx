import React from "react"
import { Marker, Popup } from "react-leaflet"
import L from "leaflet"
import type { BusWithLocation } from "@/lib/schemas/tracking"

interface MapMarkerProps {
  bus: BusWithLocation
  onSelect?: (bus: BusWithLocation) => void
}

// Custom icon factory based on bus status
const getMarkerIcon = (status: string) => {
  const statusColors: Record<string, string> = {
    in_route: "#22c55e", // green
    at_station: "#3b82f6", // blue
    maintenance: "#ef4444", // red
  }

  const color = statusColors[status] || "#6b7280"

  return L.divIcon({
    html: `
      <div style="
        background-color: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        font-weight: bold;
        color: white;
      ">
        🚌
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
    className: "bus-marker",
  })
}

// Status badge styling
const getStatusBadge = (status: string) => {
  const statusConfig: Record<string, { label: string; color: string }> = {
    in_route: { label: "En Route", color: "bg-green-100 text-green-800" },
    at_station: { label: "En Station", color: "bg-blue-100 text-blue-800" },
    maintenance: { label: "Maintenance", color: "bg-red-100 text-red-800" },
  }

  const config = statusConfig[status] || { label: "Unknown", color: "bg-gray-100 text-gray-800" }

  return <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${config.color}`}>{config.label}</span>
}

// Memoized marker component to prevent unnecessary re-renders
const MapMarkerComponent = React.memo(
  ({ bus, onSelect }: MapMarkerProps) => {
    const handleMarkerClick = () => {
      onSelect?.(bus)
    }

    return (
      <Marker
        position={[bus.location.latitude, bus.location.longitude]}
        icon={getMarkerIcon(bus.status)}
        eventHandlers={{
          click: handleMarkerClick,
        }}
      >
        <Popup>
          <div className="space-y-2 min-w-[200px]">
            <div>
              <h3 className="font-bold text-sm">Bus {bus.busNumber}</h3>
              <p className="text-xs text-gray-600">{bus.id}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-600">Status:</span>
              {getStatusBadge(bus.status)}
            </div>
            <div className="text-xs space-y-1">
              <p>
                <span className="font-semibold">Driver:</span> {bus.driver || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Occupancy:</span> {bus.occupancy}/{bus.capacity}
              </p>
              <p>
                <span className="font-semibold">Location:</span>
                <br />
                {bus.location.latitude.toFixed(4)}, {bus.location.longitude.toFixed(4)}
              </p>
              <p className="text-gray-500">Updated: {new Date(bus.lastUpdate).toLocaleTimeString()}</p>
            </div>
          </div>
        </Popup>
      </Marker>
    )
  },
  (prevProps, nextProps) => {
    // Custom comparison: only re-render if location or status changed
    return (
      prevProps.bus.location.latitude === nextProps.bus.location.latitude &&
      prevProps.bus.location.longitude === nextProps.bus.location.longitude &&
      prevProps.bus.status === nextProps.bus.status &&
      prevProps.bus.occupancy === nextProps.bus.occupancy
    )
  },
)

MapMarkerComponent.displayName = "MapMarker"

export { MapMarkerComponent as MapMarker }
