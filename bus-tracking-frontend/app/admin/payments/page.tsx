import { MainLayout } from "@/components/layout/main-layout"
import { PaymentsTable } from "@/components/payment-management/payments-table"

export default function PaymentsPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Payment Management</h1>
          <p className="text-muted-foreground">Track and manage all payments</p>
        </div>
        <PaymentsTable />
      </div>
    </MainLayout>
  )
}
