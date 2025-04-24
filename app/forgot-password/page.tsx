"use client"
import { useState } from "react"
import type React from "react"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ArrowLeft, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { authService } from "@/lib/auth-service"
import type { ForgotPasswordRequest } from "@/types/auth"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()

    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const forgotPasswordData: ForgotPasswordRequest = {
        email,
      }

      const response = await authService.forgotPassword(forgotPasswordData)

      if (response.success) {
        setSuccess(true)
        toast({
          title: "Reset link sent",
          description: "If an account exists with this email, a password reset link has been sent.",
        })
      } else {
        setError(response.message || "Failed to send password reset email")
        toast({
          title: "Error",
          description: response.message || "Failed to send password reset email",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      setError(error.message || "An unexpected error occurred")
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container flex h-screen items-center justify-center">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Reset your password</CardTitle>
          <CardDescription>Enter your email address and we'll send you a link to reset your password</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success ? (
            <Alert className="bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400">
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Check your email</AlertTitle>
              <AlertDescription>
                If an account exists with the email you entered, we've sent instructions to reset your password. Please
                check your inbox and spam folder.
              </AlertDescription>
            </Alert>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send reset link"
                )}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter>
          <div className="flex w-full flex-col space-y-2">
            <Button variant="outline" asChild className="w-full">
              <Link href="/login">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to login
              </Link>
            </Button>
            {success && (
              <p className="text-center text-sm text-muted-foreground">
                Didn't receive the email?{" "}
                <button
                  onClick={() => {
                    setSuccess(false)
                    setError(null)
                  }}
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  Try again
                </button>
              </p>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
