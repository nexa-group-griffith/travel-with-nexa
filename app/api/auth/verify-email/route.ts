import { type NextRequest, NextResponse } from "next/server"
import type { VerifyEmailRequest, VerifyEmailResponse } from "@/types/auth"
import { applyActionCode } from "firebase/auth"
import { auth } from "@/lib/firebase"

export async function POST(request: NextRequest): Promise<NextResponse<VerifyEmailResponse>> {
  try {
    const body: VerifyEmailRequest = await request.json()
    const { token } = body

    if (!token) {
      return NextResponse.json({ success: false, message: "Verification token is required" }, { status: 400 })
    }

    await applyActionCode(auth, token)

    return NextResponse.json({
      success: true,
      message: "Email verified successfully. You can now log in.",
    })
  } catch (error: any) {
    console.error("Email verification error:", error)

    let errorMessage = "Failed to verify email"
    let statusCode = 500

    if (error.code === "auth/invalid-action-code") {
      errorMessage = "Invalid or expired verification link"
      statusCode = 400
    } else if (error.code === "auth/user-not-found") {
      errorMessage = "User not found"
      statusCode = 404
    }

    return NextResponse.json({ success: false, message: errorMessage }, { status: statusCode })
  }
}
