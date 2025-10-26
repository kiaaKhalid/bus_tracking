import { MainLayout } from "@/components/layout/main-layout"

export default function UsersPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage system users and permissions</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-6">
          <p className="text-muted-foreground">Users table will be integrated here</p>
        </div>
      </div>
    </MainLayout>
  )
}
