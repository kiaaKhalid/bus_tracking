import { MainLayout } from "@/components/layout/main-layout"
import { BusesTable } from "@/components/bus-management/buses-table"

export default function BusesPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Bus Management</h1>
          <p className="text-muted-foreground">Manage your fleet of buses</p>
        </div>
        <BusesTable />
      </div>
    </MainLayout>
  )
}
