"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [verifying, setVerifying] = useState(true)
  const [validCode, setValidCode] = useState(false)
  const [email, setEmail] = useState<string | null>(null)

  const router = useRouter()
  const searchParams = useSearchParams()
  const oobCode = searchParams.get("oobCode")

  useEffect(() => {
    const verifyCode = async () => {
      if (!auth || !oobCode) {
        setVerifying(false)
        setError("Invalid or expired password reset link. Please request a new one.")
        return
      }

      try {
        // Verify the password reset code
        const email = await verifyPasswordResetCode(auth, oobCode)
        setEmail(email)
        setValidCode(true)
      } catch (error: any) {
        console.error("Error verifying reset code:", error)
        setError("Invalid or expired password reset link. Please request a new one.")
      } finally {
        setVerifying(false)
      }
    }

    verifyCode()
  }, [oobCode])

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!auth || !oobCode) {
      setError("Invalid or expired password reset link. Please request a new one.")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    if (password.length < 6) {
      setError("Password should be at least 6 characters long.")
      return
    }

    setLoading(true)
    setError(null)

    try {
      await confirmPasswordReset(auth, oobCode, password)
      setSuccess(true)
    } catch (error: any) {
      console.error("Password reset error:", error)
      setError(error.message || "Failed to reset password. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (verifying) {
    return (
      <div className="container flex h-screen items-center justify-center">
        <Card className="mx-auto w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-4 text-center">Verifying your reset link...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container flex h-screen items-center justify-center">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Reset your password</CardTitle>
          {email && validCode && !success && <CardDescription>Create a new password for {email}</CardDescription>}
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
            <div className="space-y-4">
              <Alert className="bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle>Password reset successful</AlertTitle>
                <AlertDescription>
                  Your password has been reset successfully. You can now log in with your new password.
                </AlertDescription>
              </Alert>
              <Button asChild className="w-full">
                <Link href="/login">Go to login</Link>
              </Button>
            </div>
          ) : validCode ? (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Resetting..." : "Reset Password"}
              </Button>
            </form>
          ) : (
            <div className="space-y-4">
              <p className="text-center text-muted-foreground">
                The password reset link is invalid or has expired. Please request a new one.
              </p>
              <Button asChild className="w-full">
                <Link href="/forgot-password">Request new reset link</Link>
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button variant="outline" asChild className="w-full">
            <Link href="/login">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to login
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
