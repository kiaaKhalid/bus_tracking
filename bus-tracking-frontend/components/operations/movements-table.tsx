"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useVirtualizer } from "@tanstack/react-virtual"
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { MovementBus } from "@/lib/schemas/operations"

interface MovementsTableProps {
  movements: MovementBus[]
  total: number
  isLoading: boolean
  onPageChange?: (offset: number) => void
}

const columnHelper = createColumnHelper<MovementBus>()

const columns = [
  columnHelper.accessor("plaqueDetectee", {
    header: "License Plate",
    cell: (info) => <span className="font-mono font-semibold">{info.getValue()}</span>,
  }),
  columnHelper.accessor("heureEntree", {
    header: "Entry Time",
    cell: (info) => {
      const time = info.getValue()
      return time ? new Date(time).toLocaleTimeString() : "-"
    },
  }),
  columnHelper.accessor("heureSortie", {
    header: "Exit Time",
    cell: (info) => {
      const time = info.getValue()
      return time ? new Date(time).toLocaleTimeString() : "-"
    },
  }),
  columnHelper.accessor("statut", {
    header: "Status",
    cell: (info) => {
      const status = info.getValue()
      const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
        EN_RETARD: "destructive",
        A_L_HEURE: "default",
        EN_AVANCE: "secondary",
      }
      return <Badge variant={variants[status] || "outline"}>{status}</Badge>
    },
  }),
  columnHelper.accessor("camera.location", {
    header: "Camera Location",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("confidence", {
    header: "Confidence",
    cell: (info) => {
      const confidence = info.getValue()
      return <span className="text-sm">{confidence.toFixed(1)}%</span>
    },
  }),
  columnHelper.accessor("driver", {
    header: "Driver",
    cell: (info) => info.getValue() || "-",
  }),
]

export function MovementsTable({ movements, total, isLoading, onPageChange }: MovementsTableProps) {
  const router = useRouter()
  const [{ pageIndex, pageSize }, setPagination] = useState({
    pageIndex: 0,
    pageSize: 50,
  })

  const table = useReactTable({
    data: movements,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const { rows } = table.getRowModel()

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => document.getElementById("movements-table-container"),
    estimateSize: () => 50,
    overscan: 10,
  })

  const virtualRows = virtualizer.getVirtualItems()
  const totalSize = virtualizer.getTotalSize()

  const paddingTop = virtualRows.length > 0 ? virtualRows?.[0]?.start || 0 : 0
  const paddingBottom = virtualRows.length > 0 ? totalSize - (virtualRows?.[virtualRows.length - 1]?.end || 0) : 0

  const handleRowClick = (movementId: string) => {
    router.push(`/movement-journal/${movementId}`)
  }

  if (isLoading && movements.length === 0) {
    return (
      <Card className="p-4">
        <div className="space-y-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden">
      <div id="movements-table-container" className="h-[600px] overflow-y-auto">
        <table className="w-full">
          <thead className="sticky top-0 bg-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-4 py-3 text-left text-sm font-semibold">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {paddingTop > 0 && (
              <tr>
                <td colSpan={columns.length} style={{ height: `${paddingTop}px` }} />
              </tr>
            )}
            {virtualRows.map((virtualRow) => {
              const row = rows[virtualRow.index]
              return (
                <tr
                  key={row.id}
                  className="cursor-pointer border-t hover:bg-muted/50"
                  onClick={() => handleRowClick(row.original.id)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 text-sm">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              )
            })}
            {paddingBottom > 0 && (
              <tr>
                <td colSpan={columns.length} style={{ height: `${paddingBottom}px` }} />
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="border-t bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
        Showing {movements.length} of {total} movements
      </div>
    </Card>
  )
}
