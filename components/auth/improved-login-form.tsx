"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/contexts/auth-context"
import { Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle, RefreshCw } from "lucide-react"

interface ImprovedLoginFormProps {
  onToggleMode: () => void
}

export function ImprovedLoginForm({ onToggleMode }: ImprovedLoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showResendConfirmation, setShowResendConfirmation] = useState(false)
  const [confirmationSent, setConfirmationSent] = useState(false)
  const [resendingConfirmation, setResendingConfirmation] = useState(false)
  const { signIn, resendConfirmation } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setShowResendConfirmation(false)

    try {
      await signIn(email, password)
    } catch (err: any) {
      console.error("Login error:", err)

      // Handle specific error cases
      if (err.message?.includes("Email not confirmed")) {
        setError("Please confirm your email address before signing in.")
        setShowResendConfirmation(true)
      } else if (err.message?.includes("Invalid login credentials")) {
        setError("Invalid email or password. Please check your credentials and try again.")
      } else if (err.message?.includes("Too many requests")) {
        setError("Too many login attempts. Please wait a moment before trying again.")
      } else {
        setError(err.message || "An error occurred during sign in. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleResendConfirmation = async () => {
    if (!email) {
      setError("Please enter your email address first.")
      return
    }

    setResendingConfirmation(true)
    setError("")

    try {
      await resendConfirmation(email)
      setConfirmationSent(true)
      setShowResendConfirmation(false)
    } catch (err: any) {
      setError(err.message || "Failed to resend confirmation email. Please try again.")
    } finally {
      setResendingConfirmation(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
          <CardDescription className="text-center">Sign in to your study scheduler account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}

            {showResendConfirmation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Alert>
                  <Mail className="h-4 w-4" />
                  <AlertDescription className="flex items-center justify-between">
                    <span>Need to confirm your email?</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleResendConfirmation}
                      disabled={resendingConfirmation}
                    >
                      {resendingConfirmation ? (
                        <>
                          <RefreshCw className="mr-1 h-3 w-3 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        "Resend Email"
                      )}
                    </Button>
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}

            {confirmationSent && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <AlertDescription className="text-green-800 dark:text-green-200">
                    Confirmation email sent! Please check your inbox and click the confirmation link.
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-4 text-center text-sm">
            {"Don't have an account? "}
            <Button variant="link" onClick={onToggleMode} className="p-0">
              Sign up
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
