"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { MovementFilters } from "@/components/operations/movement-filters"
import { MovementsTable } from "@/components/operations/movements-table"
import { useMovements, useCameras } from "@/hooks/use-operations"
import { Spinner } from "@/components/ui/spinner"
import type { MovementFilters as MovementFiltersType } from "@/lib/schemas/operations"

export default function MovementJournalPage() {
  const [filters, setFilters] = useState<MovementFiltersType>({})
  const [pagination, setPagination] = useState({ offset: 0, limit: 100 })

  const { movements, total, isLoading } = useMovements(filters, pagination.limit, pagination.offset)
  const { cameras, isLoading: camerasLoading } = useCameras()

  const handleFiltersChange = (newFilters: MovementFiltersType) => {
    setFilters(newFilters)
    setPagination({ offset: 0, limit: 100 })
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Movement Journal</h1>
          <p className="text-muted-foreground">ANPR operations and movement history</p>
        </div>

        <MovementFilters
          cameras={cameras}
          onFiltersChange={handleFiltersChange}
          isLoading={isLoading || camerasLoading}
        />

        {isLoading && movements.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <Spinner className="h-8 w-8" />
          </div>
        ) : (
          <MovementsTable
            movements={movements}
            total={total}
            isLoading={isLoading}
            onPageChange={(offset) => setPagination({ ...pagination, offset })}
          />
        )}
      </div>
    </MainLayout>
  )
}
