import { type NextRequest, NextResponse } from "next/server"
import type { ForgotPasswordRequest, ForgotPasswordResponse } from "@/types/auth"
import { sendPasswordResetEmail } from "firebase/auth"
import { auth } from "@/lib/firebase"

export async function POST(request: NextRequest): Promise<NextResponse<ForgotPasswordResponse>> {
  try {
    const body: ForgotPasswordRequest = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json({ success: false, message: "Email is required" }, { status: 400 })
    }

    await sendPasswordResetEmail(auth, email)

    // Always return success even if the email doesn't exist for security reasons
    return NextResponse.json({
      success: true,
      message: "If an account exists with this email, a password reset link has been sent.",
    })
  } catch (error: any) {
    console.error("Forgot password error:", error)

    // For security reasons, don't expose specific errors
    return NextResponse.json({
      success: true,
      message: "If an account exists with this email, a password reset link has been sent.",
    })
  }
}
