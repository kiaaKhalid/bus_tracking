import { MainLayout } from "@/components/layout/main-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UsersTable } from "@/components/user-management/users-table"

export default function UsersManagementPage() {
  return (
    <ProtectedRoute requiredRole={["admin"]}>
      <MainLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">User Management</h1>
            <p className="text-muted-foreground">Manage system users and their roles</p>
          </div>
          <UsersTable />
        </div>
      </MainLayout>
    </ProtectedRoute>
  )
}
