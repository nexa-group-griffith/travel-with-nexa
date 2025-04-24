"use client"
import { useState } from "react"
import type React from "react"

import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ArrowLeft, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { FaGoogle } from "react-icons/fa"
import { useToast } from "@/hooks/use-toast"
import { authService } from "@/lib/auth-service"
import type { VerifyEmailRequest } from "@/types/auth"

export default function VerifyEmailPage() {
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("oobCode")
  const { toast } = useToast()

  // If token is provided in URL, verify email automatically
  if (token && !loading && !success && !error) {
    handleVerifyEmail(token)
  }

  async function handleVerifyEmail(verificationToken: string) {
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const verifyEmailData: VerifyEmailRequest = {
        token: verificationToken,
      }

      const response = await authService.verifyEmail(verifyEmailData)

      if (response.success) {
        setSuccess(true)
        toast({
          title: "Email verified",
          description: "Your email has been verified successfully. You can now log in.",
        })
      } else {
        setError(response.message || "Failed to verify email")
        toast({
          title: "Verification failed",
          description: response.message || "Failed to verify email",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      setError(error.message || "An unexpected error occurred")
      toast({
        title: "Verification error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleLoginAndSendVerification = async (e: React.FormEvent) => {
    e.preventDefault()

    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      // This would be implemented with Firebase auth
      toast({
        title: "Verification email",
        description: "Verification email sending is not implemented in this demo",
      })
      setSuccess(true)
    } catch (error: any) {
      setError(error.message || "Failed to send verification email")
      toast({
        title: "Error",
        description: error.message || "Failed to send verification email",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError(null)

    try {
      // Import Firebase auth components
      const { GoogleAuthProvider, signInWithPopup } = await import("firebase/auth")
      const { doc, setDoc, getDoc } = await import("firebase/firestore")
      const { auth, db } = await import("@/lib/firebase")

      // Create Google auth provider
      const provider = new GoogleAuthProvider()

      // Sign in with popup
      const result = await signInWithPopup(auth, provider)
      const user = result.user

      // Check if user already exists in Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid))

      // Create or update user document
      const userData = {
        uid: user.uid,
        displayName: user.displayName || "",
        email: user.email || "",
        photoURL: user.photoURL || "",
        emailVerified: user.emailVerified,
        createdAt: userDoc.exists() ? userDoc.data().createdAt : new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      }

      await setDoc(doc(db, "users", user.uid), userData, { merge: true })

      // Store token in localStorage
      const token = await user.getIdToken()
      localStorage.setItem("auth-token", token)
      localStorage.setItem("user", JSON.stringify(userData))

      toast({
        title: "Login successful",
        description: "You have successfully logged in with Google",
      })

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (error: any) {
      console.error("Google login error:", error)

      let errorMessage = "Failed to log in with Google"

      if (error.code === "auth/popup-closed-by-user") {
        errorMessage = "Login canceled - you closed the popup"
      } else if (error.code === "auth/unauthorized-domain") {
        errorMessage = "This domain is not authorized for authentication"
      } else if (error.code === "auth/account-exists-with-different-credential") {
        errorMessage = "An account already exists with the same email address but different sign-in credentials"
      }

      setError(errorMessage)
      toast({
        title: "Google login failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // If token is provided in URL, show verification result
  if (token) {
    return (
      <div className="container flex h-screen items-center justify-center">
        <Card className="mx-auto w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Email Verification</CardTitle>
            <CardDescription>Verifying your email address</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading && (
              <div className="flex flex-col items-center justify-center py-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="mt-2">Verifying your email...</p>
              </div>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Verification Failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle>Email Verified</AlertTitle>
                <AlertDescription>
                  Your email has been verified successfully. You can now log in to your account.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/login">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go to Login
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  // If no token, show form to request verification email
  return (
    <div className="container flex h-screen items-center justify-center">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Verify your email</CardTitle>
          <CardDescription>
            We will send you a verification link to your email address to confirm your account.
          </CardDescription>
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
                A verification email has been sent to your email address. Please check your inbox and spam folder.
              </AlertDescription>
            </Alert>
          ) : (
            <form onSubmit={handleLoginAndSendVerification} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
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
                  "Send verification link"
                )}
              </Button>
            </form>
          )}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>
          <Button variant="outline" type="button" className="w-full" onClick={handleGoogleLogin} disabled={loading}>
            <FaGoogle className="mr-2 h-4 w-4" color="#4285F4" /> Google
          </Button>
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
