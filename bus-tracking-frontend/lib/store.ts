import { create } from "zustand"

interface User {
  id: string
  email: string
  role: "admin" | "operator" | "viewer"
}

interface AuthState {
  token: string | null
  user: User | null
  isLoading: boolean
  error: string | null
  setToken: (token: string | null) => void
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  logout: () => void
  isAuthenticated: () => boolean
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  user:
    typeof window !== "undefined"
      ? (() => {
          try {
            const stored = localStorage.getItem("user")
            return stored ? JSON.parse(stored) : null
          } catch {
            return null
          }
        })()
      : null,
  isLoading: false,
  error: null,
  setToken: (token) => {
    if (token) {
      localStorage.setItem("token", token)
    } else {
      localStorage.removeItem("token")
    }
    set({ token })
  },
  setUser: (user) => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user))
    } else {
      localStorage.removeItem("user")
    }
    set({ user })
  },
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  logout: () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    localStorage.removeItem("auth-timestamp")
    set({ token: null, user: null, error: null, isLoading: false })
  },
  isAuthenticated: () => {
    const { token } = get()
    return !!token
  },
}))

interface UIState {
  sidebarOpen: boolean
  toggleSidebar: () => void
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}))
