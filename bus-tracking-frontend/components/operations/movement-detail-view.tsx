"use client"

import { useState } from "react"
import Image from "next/image"
import { useMovementDetail } from "@/hooks/use-operations"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { Alert } from "@/components/ui/alert"
import { PlaqueCorrectionsForm } from "./plaque-corrections-form"
import { format } from "date-fns"

interface MovementDetailViewProps {
  movementId: string
  onBack?: () => void
}

export function MovementDetailView({ movementId, onBack }: MovementDetailViewProps) {
  const { movement, isLoading, error } = useMovementDetail(movementId)
  const [showCorrectionForm, setShowCorrectionForm] = useState(false)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  if (error || !movement) {
    return (
      <Alert variant="destructive">
        <p>Failed to load movement details. Please try again.</p>
      </Alert>
    )
  }

  const statusColor = {
    EN_RETARD: "bg-red-100 text-red-800",
    A_L_HEURE: "bg-green-100 text-green-800",
    EN_AVANCE: "bg-blue-100 text-blue-800",
  }

  return (
    <div className="space-y-6">
      {onBack && (
        <Button variant="outline" onClick={onBack}>
          ← Back to Journal
        </Button>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* License Plate Image */}
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Captured Image</h3>
          {movement.urlImagePlaque ? (
            <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
              <Image
                src={movement.urlImagePlaque || "/placeholder.svg"}
                alt="License plate capture"
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="flex h-48 items-center justify-center rounded-lg bg-muted">
              <p className="text-muted-foreground">No image available</p>
            </div>
          )}
        </Card>

        {/* Detection Info */}
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Detection Information</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Detected Plate (OCR)</p>
              <p className="text-2xl font-bold font-mono">{movement.plaqueDetectee}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Confidence Score</p>
              <div className="flex items-center gap-2">
                <div className="h-2 flex-1 rounded-full bg-muted">
                  <div className="h-full rounded-full bg-green-500" style={{ width: `${movement.confidence}%` }} />
                </div>
                <span className="text-sm font-semibold">{movement.confidence}%</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Camera</p>
              <p className="font-medium">{movement.camera.location}</p>
              <p className="text-xs text-muted-foreground">{movement.camera.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge className={statusColor[movement.statut]}>{movement.statut.replace(/_/g, " ")}</Badge>
            </div>
          </div>
        </Card>
      </div>

      {/* Bus Information */}
      {movement.busInfo && (
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Bus Information</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Bus Plate</p>
              <p className="font-mono text-lg font-bold">{movement.busInfo.plaque}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Vehicle</p>
              <p className="font-medium">
                {movement.busInfo.marque} {movement.busInfo.modele}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Driver</p>
              <p className="font-medium">{movement.busInfo.driver}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Occupancy</p>
              <p className="font-medium">{movement.occupancy || "N/A"} passengers</p>
            </div>
          </div>
        </Card>
      )}

      {/* Schedule Information */}
      {movement.scheduleInfo && (
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Schedule Information</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Route</p>
              <p className="font-medium">{movement.scheduleInfo.routeName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Scheduled Time</p>
              <p className="font-medium">{format(new Date(movement.scheduleInfo.scheduledTime), "HH:mm:ss")}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Expected Arrival</p>
              <p className="font-medium">{format(new Date(movement.scheduleInfo.expectedArrival), "HH:mm:ss")}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Correction History */}
      {movement.correctionHistory && movement.correctionHistory.length > 0 && (
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Correction History</h3>
          <div className="space-y-3">
            {movement.correctionHistory.map((correction) => (
              <div key={correction.id} className="border-l-2 border-blue-500 pl-4 py-2">
                <p className="text-sm">
                  <span className="font-mono font-semibold">{correction.originalPlaque}</span>
                  {" → "}
                  <span className="font-mono font-semibold text-green-600">{correction.correctedPlaque}</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  by {correction.correctedBy} on {format(new Date(correction.correctedAt), "PPp")}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Correction Form */}
      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Manual Correction</h3>
          {!showCorrectionForm && (
            <Button variant="outline" onClick={() => setShowCorrectionForm(true)}>
              Correct Plate
            </Button>
          )}
        </div>

        {showCorrectionForm && (
          <PlaqueCorrectionsForm
            movementId={movementId}
            currentPlaque={movement.plaqueDetectee}
            onSuccess={() => setShowCorrectionForm(false)}
            onCancel={() => setShowCorrectionForm(false)}
          />
        )}
      </Card>
    </div>
  )
}
