"use client"

import { useState } from "react"
import { useSchedules, deleteSchedule } from "@/hooks/use-schedule-management"
import { useBuses } from "@/hooks/use-bus-management"
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
import { ScheduleForm } from "./schedule-form"
import { useToast } from "@/hooks/use-toast"
import type { ScheduleManagement } from "@/lib/schemas/schedule-management"
import { Edit2, Trash2, Plus } from "lucide-react"

export function SchedulesTable() {
  const { schedules, isLoading, mutate } = useSchedules()
  const { buses } = useBuses()
  const { toast } = useToast()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState<ScheduleManagement | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [deletingScheduleId, setDeletingScheduleId] = useState<string | null>(null)

  const handleCreateSuccess = () => {
    setIsCreateDialogOpen(false)
    mutate()
  }

  const handleEditSuccess = () => {
    setIsEditDialogOpen(false)
    setEditingSchedule(null)
    mutate()
  }

  const handleDeleteConfirm = async () => {
    if (!deletingScheduleId) return

    const result = await deleteSchedule(deletingScheduleId)
    if (result.success) {
      toast({
        title: "Success",
        description: "Schedule deleted successfully",
      })
      mutate()
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to delete schedule",
        variant: "destructive",
      })
    }
    setDeletingScheduleId(null)
  }

  const getBusPlate = (busId: string) => {
    return buses.find((b) => b.id === busId)?.plaqueImmatriculation || "Unknown"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIF":
        return "bg-green-100 text-green-800"
      case "INACTIF":
        return "bg-gray-100 text-gray-800"
      case "SUSPENDU":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (isLoading) {
    return <div className="text-center py-8">Loading schedules...</div>
  }

  return (
    <div className="space-y-4">
      {/* Create Button */}
      <div className="flex justify-end">
        <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Schedule
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Route/Line</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Bus</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Departure</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Arrival</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Days</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {schedules.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">
                  No schedules found. Create one to get started.
                </td>
              </tr>
            ) : (
              schedules.map((schedule) => (
                <tr key={schedule.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 font-medium">{schedule.ligne}</td>
                  <td className="px-6 py-4">{getBusPlate(schedule.busId)}</td>
                  <td className="px-6 py-4">{schedule.heureDepartPrevue}</td>
                  <td className="px-6 py-4">{schedule.heureArriveePrevue}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex flex-wrap gap-1">
                      {schedule.jours.map((day) => (
                        <span key={day} className="bg-muted px-2 py-1 rounded text-xs">
                          {day.slice(0, 3)}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(schedule.statut)}`}
                    >
                      {schedule.statut}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingSchedule(schedule)
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
                        onClick={() => setDeletingScheduleId(schedule.id)}
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
            <DialogTitle>Add New Schedule</DialogTitle>
            <DialogDescription>Fill in the details to add a new schedule.</DialogDescription>
          </DialogHeader>
          <ScheduleForm onSuccess={handleCreateSuccess} onCancel={() => setIsCreateDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Schedule</DialogTitle>
            <DialogDescription>Update the schedule information.</DialogDescription>
          </DialogHeader>
          {editingSchedule && (
            <ScheduleForm
              schedule={editingSchedule}
              onSuccess={handleEditSuccess}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingScheduleId} onOpenChange={(open) => !open && setDeletingScheduleId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Schedule</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this schedule? This action cannot be undone.
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
