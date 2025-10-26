"use client"
import { MainLayout } from "@/components/layout/main-layout"
import { MovementDetailView } from "@/components/operations/movement-detail-view"

interface MovementDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function MovementDetailPage({ params }: MovementDetailPageProps) {
  const { id } = await params

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Movement Details</h1>
          <p className="text-muted-foreground">View and correct ANPR detection data</p>
        </div>

        <MovementDetailView movementId={id} />
      </div>
    </MainLayout>
  )
}
