"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuthStore } from "@/lib/store"
import { AuthService } from "@/lib/services/auth-service"

const PUBLIC_ROUTES = ["/login", "/signup", "/forgot-password"]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { setToken, setUser, token, isAuthenticated } = useAuthStore()
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log("[v0] Initializing authentication")
        const storedToken = AuthService.getTokenFromStorage()

        if (storedToken) {
          console.log("[v0] Token found in storage, validating...")

          if (!AuthService.isSessionValid()) {
            console.log("[v0] Session expired, clearing auth")
            AuthService.removeTokenFromStorage()
            setToken(null)
            setUser(null)
            setIsInitialized(true)
            return
          }

          setToken(storedToken)

          const isValid = await AuthService.validateToken(storedToken)
          if (!isValid) {
            console.log("[v0] Token validation failed, clearing auth")
            AuthService.removeTokenFromStorage()
            setToken(null)
            setUser(null)
          } else {
            console.log("[v0] Token validated successfully")
          }
        }

        setIsInitialized(true)
      } catch (error) {
        console.log("[v0] Auth initialization error:", error)
        setIsInitialized(true)
      }
    }

    initializeAuth()
  }, [setToken, setUser])

  useEffect(() => {
    if (!isInitialized) return

    const isPublicRoute = PUBLIC_ROUTES.includes(pathname)
    const isAuth = isAuthenticated()

    console.log("[v0] Route check - pathname:", pathname, "isAuth:", isAuth, "isPublic:", isPublicRoute)

    if (!isAuth && !isPublicRoute) {
      console.log("[v0] Redirecting to login - not authenticated")
      router.push("/login")
    } else if (isAuth && PUBLIC_ROUTES.includes(pathname)) {
      console.log("[v0] Redirecting to dashboard - already authenticated")
      router.push("/dashboard")
    }
  }, [isInitialized, pathname, isAuthenticated, router])

  if (!isInitialized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm text-muted-foreground">Initialisation...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
