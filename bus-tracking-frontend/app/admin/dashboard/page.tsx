"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { StatsCard } from "@/components/dashboard/stats-card"
import { LiveFeed } from "@/components/dashboard/live-feed"
import { useDashboardStats, useDailyPayments } from "@/hooks/use-dashboard"
import { AlertCircle, Bus, Navigation, Users, TrendingUp } from "lucide-react"

export default function DashboardPage() {
  const { stats, isLoading: statsLoading } = useDashboardStats()
  const { totalPayments, isLoading: paymentsLoading } = useDailyPayments()

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to the Bus Management System</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            label="Total Buses"
            value={stats?.totalBuses ?? 0}
            isLoading={statsLoading}
            icon={<Bus className="h-5 w-5" />}
          />
          <StatsCard
            label="Buses in Route"
            value={stats?.busesInRoute ?? 0}
            isLoading={statsLoading}
            icon={<Navigation className="h-5 w-5" />}
          />
          <StatsCard
            label="Total Drivers"
            value={stats?.totalDrivers ?? 0}
            isLoading={statsLoading}
            icon={<Users className="h-5 w-5" />}
          />
          <StatsCard
            label="Daily Payments"
            value={`$${totalPayments.toFixed(2)}`}
            isLoading={paymentsLoading}
            icon={<TrendingUp className="h-5 w-5" />}
          />
        </div>

        {/* System Status and Live Feed */}
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <LiveFeed />
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">System Status</p>
                <p className="text-lg font-semibold text-green-600">
                  {stats?.systemStatus === "online" ? "Online" : "Offline"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
