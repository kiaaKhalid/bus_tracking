"use client"

import { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AuthService, AuthError } from "@/lib/services/auth-service"
import { forgotPasswordSchema, type ForgotPasswordFormData } from "@/lib/schemas/auth"
import { Mail, ArrowLeft, CheckCircle2, Building2 } from "lucide-react"

export function ForgotPasswordForm() {
  const [step, setStep] = useState<"email" | "otp" | "reset" | "success">("email")
  const [email, setEmail] = useState("")
  const [resetToken, setResetToken] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const handleEmailSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true)
    setApiError(null)

    try {
      await AuthService.forgotPassword(data.email)
      setEmail(data.email)
      setStep("otp")
    } catch (err) {
      let message = "Erreur lors de la demande de réinitialisation"
      if (err instanceof AuthError) {
        message = err.message
      } else if (err instanceof Error) {
        message = err.message
      }
      setApiError(message)
    } finally {
      setIsLoading(false)
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
                <h2 className="text-3xl font-bold text-slate-900 mb-2">
                  {step === "email" && "Reset Password"}
                  {step === "otp" && "Verify Code"}
                  {step === "reset" && "New Password"}
                  {step === "success" && "Success!"}
                </h2>
                <p className="text-slate-600">
                  {step === "email" && "Enter your email to receive a verification code"}
                  {step === "otp" && "Enter the 6-digit code sent to your email"}
                  {step === "reset" && "Create a new secure password"}
                  {step === "success" && "Your password has been reset"}
                </p>
              </div>

              {step === "email" && (
                <form onSubmit={handleSubmit(handleEmailSubmit)} className="space-y-6">
                  {apiError && (
                    <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">
                      {apiError}
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

                  <Button
                    type="submit"
                    className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors"
                    disabled={isLoading}
                  >
                    {isLoading ? "Sending..." : "Send Code"}
                  </Button>

                  <Link href="/login">
                    <Button type="button" variant="ghost" className="w-full text-slate-600 hover:text-slate-900">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Sign In
                    </Button>
                  </Link>
                </form>
              )}

              {step === "otp" && (
                <OtpVerification
                  email={email}
                  onSuccess={(token) => {
                    setResetToken(token)
                    setStep("reset")
                  }}
                  onError={(err) => setApiError(err)}
                  onBack={() => setStep("email")}
                />
              )}

              {step === "reset" && (
                <ResetPasswordForm
                  resetToken={resetToken}
                  onSuccess={() => setStep("success")}
                  onError={(err) => setApiError(err)}
                  onBack={() => setStep("otp")}
                />
              )}

              {step === "success" && (
                <div className="text-center space-y-6">
                  <div className="flex justify-center">
                    <CheckCircle2 className="w-16 h-16 text-green-600" />
                  </div>
                  <p className="text-slate-600">Your password has been reset successfully.</p>
                  <Link href="/login">
                    <Button className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl">
                      Back to Sign In
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function OtpVerification({
  email,
  onSuccess,
  onError,
  onBack,
}: { email: string; onSuccess: (token: string) => void; onError: (err: string) => void; onBack: () => void }) {
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleVerify = async () => {
    if (otp.length !== 6) {
      onError("The OTP code must contain 6 digits")
      return
    }

    setIsLoading(true)
    try {
      const result = await AuthService.verifyOtp(email, otp)
      onSuccess(result.resetToken)
    } catch (err) {
      let message = "Invalid OTP code"
      if (err instanceof AuthError) {
        message = err.message
      } else if (err instanceof Error) {
        message = err.message
      }
      onError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="otp" className="text-sm font-medium text-slate-700">
          Verification Code
        </label>
        <Input
          id="otp"
          type="text"
          placeholder="000000"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          disabled={isLoading}
          className="h-12 bg-white border-2 border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:border-green-600 focus:ring-0 text-center text-2xl tracking-widest"
        />
        <p className="text-xs text-slate-500">Check your email for the code</p>
      </div>

      <Button
        onClick={handleVerify}
        className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors"
        disabled={isLoading || otp.length !== 6}
      >
        {isLoading ? "Verifying..." : "Verify Code"}
      </Button>

      <Button type="button" variant="ghost" className="w-full text-slate-600 hover:text-slate-900" onClick={onBack}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>
    </div>
  )
}

function ResetPasswordForm({
  resetToken,
  onSuccess,
  onError,
  onBack,
}: { resetToken: string; onSuccess: () => void; onError: (err: string) => void; onBack: () => void }) {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)

  const calculatePasswordStrength = (pwd: string) => {
    let strength = 0
    if (pwd.length >= 8) strength++
    if (/[A-Z]/.test(pwd)) strength++
    if (/[0-9]/.test(pwd)) strength++
    if (/[!@#$%^&*]/.test(pwd)) strength++
    setPasswordStrength(strength)
  }

  const handleReset = async () => {
    if (password !== confirmPassword) {
      onError("Passwords do not match")
      return
    }

    if (passwordStrength < 2) {
      onError("Password is not strong enough")
      return
    }

    setIsLoading(true)
    try {
      await AuthService.resetPassword(resetToken, password)
      onSuccess()
    } catch (err) {
      let message = "Error resetting password"
      if (err instanceof AuthError) {
        message = err.message
      } else if (err instanceof Error) {
        message = err.message
      }
      onError(message)
    } finally {
      setIsLoading(false)
    }
  }

  const strengthLabels = ["Weak", "Fair", "Good", "Strong"]
  const strengthColors = ["bg-red-500", "bg-yellow-500", "bg-blue-500", "bg-green-500"]

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium text-slate-700">
          New Password
        </label>
        <div className="relative">
          <Input
            id="password"
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              calculatePasswordStrength(e.target.value)
            }}
            disabled={isLoading}
            className="pl-4 h-12 bg-white border-2 border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:border-green-600 focus:ring-0"
          />
        </div>
        {password && (
          <div className="space-y-2">
            <div className="flex gap-1">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 flex-1 rounded-full ${i < passwordStrength ? strengthColors[passwordStrength - 1] : "bg-slate-200"}`}
                />
              ))}
            </div>
            <p className="text-xs text-slate-500">
              Strength:{" "}
              <span className="text-slate-700 font-medium">{strengthLabels[passwordStrength - 1] || "Very Weak"}</span>
            </p>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700">
          Confirm Password
        </label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={isLoading}
          className="h-12 bg-white border-2 border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:border-green-600 focus:ring-0"
        />
      </div>

      <Button
        onClick={handleReset}
        className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors"
        disabled={isLoading || !password || !confirmPassword}
      >
        {isLoading ? "Resetting..." : "Reset Password"}
      </Button>

      <Button type="button" variant="ghost" className="w-full text-slate-600 hover:text-slate-900" onClick={onBack}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>
    </div>
  )
}
