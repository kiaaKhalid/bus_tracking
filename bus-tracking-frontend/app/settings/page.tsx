import { MainLayout } from "@/components/layout/main-layout"

export default function SettingsPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">System configuration and preferences</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-6">
          <p className="text-muted-foreground">Settings will be integrated here</p>
        </div>
      </div>
    </MainLayout>
  )
}
