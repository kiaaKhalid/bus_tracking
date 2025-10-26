import { type AuthResponse, authResponseSchema } from "@/lib/schemas/auth"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

export class AuthError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message)
    this.name = "AuthError"
  }
}

export class AuthService {
  static async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Handle specific error messages from API
        const errorMessage = data.message || data.error || "Erreur d'authentification"
        throw new AuthError(response.status, errorMessage)
      }

      return authResponseSchema.parse(data)
    } catch (error) {
      if (error instanceof AuthError) {
        throw error
      }
      if (error instanceof Error) {
        throw new AuthError(500, error.message)
      }
      throw new AuthError(500, "Erreur de connexion")
    }
  }

  static async signup(name: string, email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        const errorMessage = data.message || data.error || "Erreur d'inscription"
        throw new AuthError(response.status, errorMessage)
      }

      return authResponseSchema.parse(data)
    } catch (error) {
      if (error instanceof AuthError) {
        throw error
      }
      if (error instanceof Error) {
        throw new AuthError(500, error.message)
      }
      throw new AuthError(500, "Erreur d'inscription")
    }
  }

  static async loginWithGoogle(idToken: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }),
      })

      const data = await response.json()

      if (!response.ok) {
        const errorMessage = data.message || data.error || "Erreur d'authentification Google"
        throw new AuthError(response.status, errorMessage)
      }

      return authResponseSchema.parse(data)
    } catch (error) {
      if (error instanceof AuthError) {
        throw error
      }
      if (error instanceof Error) {
        throw new AuthError(500, error.message)
      }
      throw new AuthError(500, "Erreur d'authentification Google")
    }
  }

  static async validateToken(token: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/validate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      return response.ok
    } catch {
      return false
    }
  }

  static async forgotPassword(email: string): Promise<{ message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        const errorMessage = data.message || data.error || "Erreur lors de la demande de réinitialisation"
        throw new AuthError(response.status, errorMessage)
      }

      return data
    } catch (error) {
      if (error instanceof AuthError) {
        throw error
      }
      if (error instanceof Error) {
        throw new AuthError(500, error.message)
      }
      throw new AuthError(500, "Erreur lors de la demande de réinitialisation")
    }
  }

  static async verifyOtp(email: string, otp: string): Promise<{ resetToken: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      })

      const data = await response.json()

      if (!response.ok) {
        const errorMessage = data.message || data.error || "Code OTP invalide"
        throw new AuthError(response.status, errorMessage)
      }

      return data
    } catch (error) {
      if (error instanceof AuthError) {
        throw error
      }
      if (error instanceof Error) {
        throw new AuthError(500, error.message)
      }
      throw new AuthError(500, "Erreur lors de la vérification du code OTP")
    }
  }

  static async resetPassword(resetToken: string, password: string): Promise<{ message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ resetToken, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        const errorMessage = data.message || data.error || "Erreur lors de la réinitialisation du mot de passe"
        throw new AuthError(response.status, errorMessage)
      }

      return data
    } catch (error) {
      if (error instanceof AuthError) {
        throw error
      }
      if (error instanceof Error) {
        throw new AuthError(500, error.message)
      }
      throw new AuthError(500, "Erreur lors de la réinitialisation du mot de passe")
    }
  }

  static async refreshToken(token: string): Promise<string> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Token refresh failed")
      }

      const data = await response.json()
      return data.token
    } catch (error) {
      throw error instanceof Error ? error : new Error("Token refresh failed")
    }
  }

  static getTokenFromStorage(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem("token")
  }

  static setTokenInStorage(token: string): void {
    if (typeof window === "undefined") return
    localStorage.setItem("token", token)
    localStorage.setItem("auth-timestamp", new Date().toISOString())
  }

  static removeTokenFromStorage(): void {
    if (typeof window === "undefined") return
    localStorage.removeItem("token")
    localStorage.removeItem("auth-timestamp")
  }

  static getAuthHeader(): { Authorization: string } | {} {
    const token = this.getTokenFromStorage()
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  static isSessionValid(): boolean {
    const token = this.getTokenFromStorage()
    const timestamp = localStorage.getItem("auth-timestamp")

    if (!token || !timestamp) return false

    // Session valid for 24 hours
    const sessionDuration = 24 * 60 * 60 * 1000
    const sessionTime = new Date(timestamp).getTime()
    const currentTime = new Date().getTime()

    return currentTime - sessionTime < sessionDuration
  }
}
