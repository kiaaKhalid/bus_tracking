import { MainLayout } from "@/components/layout/main-layout"
import { GPSMap } from "@/components/tracking/gps-map"

export default function TrackingPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Live GPS Tracking</h1>
          <p className="text-muted-foreground">Real-time bus location tracking with dynamic markers</p>
        </div>
        <GPSMap />
      </div>
    </MainLayout>
  )
}
