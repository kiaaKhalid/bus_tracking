"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuthStore } from "@/lib/store"
import { AuthService, AuthError } from "@/lib/services/auth-service"
import { loginSchema, type LoginFormData } from "@/lib/schemas/auth"
import { Mail, Lock, ArrowRight, Building2 } from "lucide-react"

export function LoginForm() {
  const router = useRouter()
  const { setToken, setUser, setLoading, setError, isLoading, error } = useAuthStore()
  const [apiError, setApiError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true)
    setApiError(null)
    setError(null)

    try {
      const response = await AuthService.login(data.email, data.password)
      setToken(response.accessToken)
      setUser(response.user)
      AuthService.setTokenInStorage(response.accessToken)
      router.push("/dashboard")
    } catch (err) {
      let message = "Erreur d'authentification"

      if (err instanceof AuthError) {
        if (err.statusCode === 401) {
          message = "Email ou mot de passe incorrect"
        } else if (err.statusCode === 400) {
          message = "Données invalides"
        } else if (err.statusCode === 500) {
          message = "Erreur serveur. Veuillez réessayer plus tard"
        } else {
          message = err.message
        }
      } else if (err instanceof Error) {
        message = err.message
      }

      setApiError(message)
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="hidden lg:flex flex-col justify-between h-full min-h-[600px] bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute inset-0 opacity-40">
              <img
                src="/aerial-view-of-residential-houses-with-green-lands.jpg"
                alt="Green Valley Residence"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm mb-6">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-white mb-3">WELCOME TO</h2>
              <h1 className="text-5xl font-bold text-white mb-4">
                Green Valley
                <br />
                Residence
              </h1>
              <p className="text-lg text-white/80">Fresh Air, Light Heart, Happy Life.</p>
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">SIGN IN</h2>
                <p className="text-slate-600">Access your account</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {(apiError || error) && (
                  <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">
                    {apiError || error}
                  </div>
                )}

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-slate-700">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      disabled={isLoading}
                      className="pl-12 h-12 bg-white border-2 border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:border-green-600 focus:ring-0"
                      {...register("email")}
                    />
                  </div>
                  {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="text-sm font-medium text-slate-700">
                      Password
                    </label>
                    <Link href="/forgot-password" className="text-sm text-green-600 hover:text-green-700 font-medium">
                      Forgot?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      disabled={isLoading}
                      className="pl-12 h-12 bg-white border-2 border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:border-green-600 focus:ring-0"
                      {...register("password")}
                    />
                  </div>
                  {errors.password && <p className="text-xs text-red-600">{errors.password.message}</p>}
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                  {!isLoading && <ArrowRight className="ml-2 w-4 h-4" />}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-3 bg-white text-slate-500">Or</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 border-2 border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl font-medium bg-transparent"
                  disabled={isLoading}
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Sign In With Google
                </Button>
              </form>

              <div className="text-center text-sm text-slate-600">
                Don't have an account?{" "}
                <Link href="/signup" className="text-green-600 hover:text-green-700 font-semibold">
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}