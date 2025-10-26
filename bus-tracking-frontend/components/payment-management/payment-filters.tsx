"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Filter, X } from "lucide-react"

interface PaymentFiltersProps {
  onFiltersChange: (filters: FilterState) => void
}

export interface FilterState {
  statut?: string
  busId?: string
  dateFrom?: string
  dateTo?: string
}

export function PaymentFilters({ onFiltersChange }: PaymentFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({})
  const [isExpanded, setIsExpanded] = useState(false)

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value || undefined }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const handleReset = () => {
    setFilters({})
    onFiltersChange({})
  }

  const activeFiltersCount = Object.values(filters).filter(Boolean).length

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 font-semibold text-sm hover:text-primary transition-colors"
        >
          <Filter className="h-4 w-4" />
          Filters{" "}
          {activeFiltersCount > 0 && (
            <span className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
              {activeFiltersCount}
            </span>
          )}
        </button>
        {activeFiltersCount > 0 && (
          <Button variant="ghost" size="sm" onClick={handleReset} className="gap-1">
            <X className="h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      {isExpanded && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Status Filter */}
          <div>
            <label className="text-sm font-medium mb-2 block">Status</label>
            <Select
              value={filters.statut || "ALL_STATUSES"}
              onValueChange={(value) => handleFilterChange("statut", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL_STATUSES">All statuses</SelectItem>
                <SelectItem value="PAYE">Paid</SelectItem>
                <SelectItem value="EN_ATTENTE">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bus Filter */}
          <div>
            <label className="text-sm font-medium mb-2 block">Bus</label>
            <Input
              placeholder="Filter by bus ID"
              value={filters.busId || ""}
              onChange={(e) => handleFilterChange("busId", e.target.value)}
            />
          </div>

          {/* Date From */}
          <div>
            <label className="text-sm font-medium mb-2 block">From Date</label>
            <Input
              type="date"
              value={filters.dateFrom || ""}
              onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
            />
          </div>

          {/* Date To */}
          <div>
            <label className="text-sm font-medium mb-2 block">To Date</label>
            <Input
              type="date"
              value={filters.dateTo || ""}
              onChange={(e) => handleFilterChange("dateTo", e.target.value)}
            />
          </div>
        </div>
      )}
    </Card>
  )
}
