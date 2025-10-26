"use client"

import { useAuthStore } from "@/lib/store"
import { AuthService } from "@/lib/services/auth-service"

export function useAuth() {
  const { token, user, isLoading, error, setToken, setUser, setLoading, setError, logout, isAuthenticated } =
    useAuthStore()

  const login = async (email: string, password: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await AuthService.login(email, password)
      setToken(response.token)
      setUser(response.user)
      return response
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur d'authentification"
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const refreshToken = async () => {
    if (!token) return

    try {
      const newToken = await AuthService.refreshToken(token)
      setToken(newToken)
      return newToken
    } catch (err) {
      logout()
      throw err
    }
  }

  return {
    token,
    user,
    isLoading,
    error,
    isAuthenticated: isAuthenticated(),
    login,
    logout,
    refreshToken,
  }
}
