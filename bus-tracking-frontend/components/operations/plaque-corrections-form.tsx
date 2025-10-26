"use client"

import type React from "react"

import { useState } from "react"
import { usePlaqueCorrection } from "@/hooks/use-operations"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"

interface PlaqueCorrectionsFormProps {
  movementId: string
  currentPlaque: string
  onSuccess?: () => void
  onCancel?: () => void
}

export function PlaqueCorrectionsForm({ movementId, currentPlaque, onSuccess, onCancel }: PlaqueCorrectionsFormProps) {
  const [correctedPlaque, setCorrectedPlaque] = useState("")
  const [reason, setReason] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const { submitCorrection, isSubmitting, error } = usePlaqueCorrection()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!correctedPlaque.trim()) {
      return
    }

    try {
      await submitCorrection({
        movementId,
        correctedPlaque: correctedPlaque.toUpperCase(),
        reason,
      })

      setSuccessMessage("Plate correction submitted successfully!")
      setCorrectedPlaque("")
      setReason("")

      setTimeout(() => {
        setSuccessMessage("")
        onSuccess?.()
      }, 2000)
    } catch (err) {
      console.error("Correction submission failed:", err)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <p>{error}</p>
        </Alert>
      )}

      {successMessage && (
        <Alert variant="default" className="border-green-500 bg-green-50">
          <p className="text-green-800">{successMessage}</p>
        </Alert>
      )}

      <div>
        <label className="block text-sm font-medium">Current Detected Plate</label>
        <div className="mt-1 rounded-lg bg-muted p-3 font-mono text-lg font-bold">{currentPlaque}</div>
      </div>

      <div>
        <label htmlFor="corrected-plate" className="block text-sm font-medium">
          Corrected Plate *
        </label>
        <Input
          id="corrected-plate"
          type="text"
          placeholder="Enter corrected plate (e.g., ABC-1234)"
          value={correctedPlaque}
          onChange={(e) => setCorrectedPlaque(e.target.value.toUpperCase())}
          disabled={isSubmitting}
          className="mt-1 font-mono"
          required
        />
      </div>

      <div>
        <label htmlFor="reason" className="block text-sm font-medium">
          Reason for Correction (optional)
        </label>
        <Input
          id="reason"
          type="text"
          placeholder="e.g., OCR misread character, poor image quality"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          disabled={isSubmitting}
          className="mt-1"
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={isSubmitting || !correctedPlaque.trim()} className="flex-1">
          {isSubmitting ? (
            <>
              <Spinner className="mr-2 h-4 w-4" />
              Submitting...
            </>
          ) : (
            "Submit Correction"
          )}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
