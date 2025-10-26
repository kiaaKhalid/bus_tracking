import { MainLayout } from "@/components/layout/main-layout"

export default function CamerasPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Cameras</h1>
          <p className="text-muted-foreground">Manage ANPR cameras and monitoring</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-6">
          <p className="text-muted-foreground">Cameras management will be integrated here</p>
        </div>
      </div>
    </MainLayout>
  )
}
