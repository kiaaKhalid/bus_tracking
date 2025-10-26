"use client"

import { useRecentMovements } from "@/hooks/use-dashboard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDistanceToNow } from "date-fns"

export function LiveFeed() {
  const { movements, isLoading } = useRecentMovements(5)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Live Feed</CardTitle>
        <CardDescription>Recent bus movements</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            <>
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-6 w-16" />
                </div>
              ))}
            </>
          ) : movements.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground">No recent movements</p>
          ) : (
            movements.map((movement) => (
              <div key={movement.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                <div className="flex-1">
                  <p className="font-medium">
                    Bus {movement.busNumber}
                    <span className="ml-2 text-sm text-muted-foreground">{movement.location}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(movement.timestamp), { addSuffix: true })}
                  </p>
                </div>
                <Badge variant={movement.type === "entry" ? "default" : "secondary"}>
                  {movement.type === "entry" ? "Entry" : "Exit"}
                </Badge>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
