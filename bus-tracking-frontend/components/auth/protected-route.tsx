"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/store"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: string[]
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const router = useRouter()
  const { token, user, isLoading } = useAuthStore()

  useEffect(() => {
    if (!isLoading && !token) {
      router.push("/login")
      return
    }

    if (requiredRole && user && !requiredRole.includes(user.role)) {
      router.push("/dashboard")
    }
  }, [token, user, isLoading, requiredRole, router])

  if (!token) {
    return null
  }

  if (requiredRole && user && !requiredRole.includes(user.role)) {
    return null
  }

  return <>{children}</>
}
