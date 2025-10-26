import { MainLayout } from "@/components/layout/main-layout"
import { SchedulesTable } from "@/components/schedule-management/schedules-table"

export default function SchedulesPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Schedule Management</h1>
          <p className="text-muted-foreground">Manage bus schedules and routes</p>
        </div>
        <SchedulesTable />
      </div>
    </MainLayout>
  )
}
