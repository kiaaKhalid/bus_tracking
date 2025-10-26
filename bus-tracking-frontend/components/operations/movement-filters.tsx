"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import type { MovementFilters as MovementFiltersType } from "@/lib/schemas/operations"

interface MovementFiltersProps {
  cameras: Array<{ id: string; name: string }>
  onFiltersChange: (filters: MovementFiltersType) => void
  isLoading?: boolean
}

export function MovementFilters({ cameras, onFiltersChange, isLoading }: MovementFiltersProps) {
  const [filters, setFilters] = useState<MovementFiltersType>({})

  const handleFilterChange = (key: keyof MovementFiltersType, value: string | undefined) => {
    const newFilters = { ...filters, [key]: value || undefined }
    setFilters(newFilters)
  }

  const handleApplyFilters = () => {
    onFiltersChange(filters)
  }

  const handleReset = () => {
    setFilters({})
    onFiltersChange({})
  }

  return (
    <Card className="p-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <div>
          <label className="text-sm font-medium">Start Date</label>
          <Input
            type="date"
            value={filters.startDate || ""}
            onChange={(e) => handleFilterChange("startDate", e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="text-sm font-medium">End Date</label>
          <Input
            type="date"
            value={filters.endDate || ""}
            onChange={(e) => handleFilterChange("endDate", e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="text-sm font-medium">Camera</label>
          <Select value={filters.cameraId || "all"} onValueChange={(value) => handleFilterChange("cameraId", value)}>
            <SelectTrigger disabled={isLoading}>
              <SelectValue placeholder="All cameras" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All cameras</SelectItem>
              {cameras.map((camera) => (
                <SelectItem key={camera.id} value={camera.id}>
                  {camera.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium">Status</label>
          <Select value={filters.statut || "all"} onValueChange={(value) => handleFilterChange("statut", value as any)}>
            <SelectTrigger disabled={isLoading}>
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="EN_RETARD">Late</SelectItem>
              <SelectItem value="A_L_HEURE">On Time</SelectItem>
              <SelectItem value="EN_AVANCE">Early</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium">License Plate</label>
          <Input
            placeholder="Search plate..."
            value={filters.searchPlaque || ""}
            onChange={(e) => handleFilterChange("searchPlaque", e.target.value)}
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <Button onClick={handleApplyFilters} disabled={isLoading}>
          Apply Filters
        </Button>
        <Button variant="outline" onClick={handleReset} disabled={isLoading}>
          Reset
        </Button>
      </div>
    </Card>
  )
}
