"use client"

import { useState } from "react"
import { useBuses, deleteBus } from "@/hooks/use-bus-management"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { BusForm } from "./bus-form"
import { useToast } from "@/hooks/use-toast"
import type { BusManagement } from "@/lib/schemas/bus-management"
import { Edit2, Trash2, Plus } from "lucide-react"

export function BusesTable() {
  const { buses, isLoading, mutate } = useBuses()
  const { toast } = useToast()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingBus, setEditingBus] = useState<BusManagement | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [deletingBusId, setDeletingBusId] = useState<string | null>(null)

  const handleCreateSuccess = () => {
    setIsCreateDialogOpen(false)
    mutate()
  }

  const handleEditSuccess = () => {
    setIsEditDialogOpen(false)
    setEditingBus(null)
    mutate()
  }

  const handleDeleteConfirm = async () => {
    if (!deletingBusId) return

    const result = await deleteBus(deletingBusId)
    if (result.success) {
      toast({
        title: "Success",
        description: "Bus deleted successfully",
      })
      mutate()
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to delete bus",
        variant: "destructive",
      })
    }
    setDeletingBusId(null)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "EN_STATION":
        return "bg-blue-100 text-blue-800"
      case "EN_ROUTE":
        return "bg-green-100 text-green-800"
      case "MAINTENANCE":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (isLoading) {
    return <div className="text-center py-8">Loading buses...</div>
  }

  return (
    <div className="space-y-4">
      {/* Create Button */}
      <div className="flex justify-end">
        <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Bus
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">License Plate</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Company</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Capacity</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Driver</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {buses.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                  No buses found. Create one to get started.
                </td>
              </tr>
            ) : (
              buses.map((bus) => (
                <tr key={bus.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 font-medium">{bus.plaqueImmatriculation}</td>
                  <td className="px-6 py-4">{bus.compagnie}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(bus.statut)}`}
                    >
                      {bus.statut.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4">{bus.capacite} seats</td>
                  <td className="px-6 py-4">{bus.conducteur || "-"}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingBus(bus)
                          setIsEditDialogOpen(true)
                        }}
                        className="gap-1"
                      >
                        <Edit2 className="h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeletingBusId(bus.id)}
                        className="gap-1 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Bus</DialogTitle>
            <DialogDescription>Fill in the details to add a new bus to your fleet.</DialogDescription>
          </DialogHeader>
          <BusForm onSuccess={handleCreateSuccess} onCancel={() => setIsCreateDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Bus</DialogTitle>
            <DialogDescription>Update the bus information.</DialogDescription>
          </DialogHeader>
          {editingBus && (
            <BusForm bus={editingBus} onSuccess={handleEditSuccess} onCancel={() => setIsEditDialogOpen(false)} />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingBusId} onOpenChange={(open) => !open && setDeletingBusId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Bus</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this bus? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
