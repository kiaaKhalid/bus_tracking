"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { CameraForm } from "@/components/system-configuration/camera-form"
import { CamerasTable } from "@/components/system-configuration/cameras-table"
import { StationInfoForm } from "@/components/system-configuration/station-info-form"
import { useSystemConfiguration } from "@/hooks/use-system-configuration"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Settings } from "lucide-react"
import type { CameraConfig, CameraFormData } from "@/lib/schemas/system-configuration"

export default function SystemConfigurationPage() {
  const { cameras, camerasLoading, createCamera, updateCamera, deleteCamera, station, stationLoading, updateStation } =
    useSystemConfiguration()

  const [cameraFormOpen, setCameraFormOpen] = useState(false)
  const [selectedCamera, setSelectedCamera] = useState<CameraConfig | undefined>()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCameraSubmit = async (data: CameraFormData) => {
    try {
      setIsSubmitting(true)
      if (selectedCamera) {
        await updateCamera(selectedCamera.id, data)
      } else {
        await createCamera(data)
      }
      setSelectedCamera(undefined)
      setCameraFormOpen(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditCamera = (camera: CameraConfig) => {
    setSelectedCamera(camera)
    setCameraFormOpen(true)
  }

  const handleAddCamera = () => {
    setSelectedCamera(undefined)
    setCameraFormOpen(true)
  }

  const handleStationSubmit = async (data: any) => {
    try {
      setIsSubmitting(true)
      await updateStation(data)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Settings className="h-8 w-8" />
              <h1 className="text-3xl font-bold">System Configuration</h1>
            </div>
            <p className="text-muted-foreground">Manage hardware and station information</p>
          </div>
        </div>

        {/* Cameras Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Camera Management</CardTitle>
                <CardDescription>Configure ANPR cameras and monitoring devices</CardDescription>
              </div>
              <Button onClick={handleAddCamera} disabled={camerasLoading}>
                <Plus className="mr-2 h-4 w-4" />
                Add Camera
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <CamerasTable
              cameras={cameras}
              isLoading={camerasLoading}
              onEdit={handleEditCamera}
              onDelete={deleteCamera}
            />
          </CardContent>
        </Card>

        {/* Station Information Section */}
        <StationInfoForm station={station} isLoading={stationLoading} onSubmit={handleStationSubmit} />
      </div>

      {/* Camera Form Dialog */}
      <CameraForm
        open={cameraFormOpen}
        onOpenChange={setCameraFormOpen}
        onSubmit={handleCameraSubmit}
        initialData={selectedCamera}
        isLoading={isSubmitting}
      />
    </MainLayout>
  )
}
