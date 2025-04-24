import { type NextRequest, NextResponse } from "next/server"
import type { RegisterRequest, RegisterResponse } from "@/types/auth"
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"

export async function POST(request: NextRequest): Promise<NextResponse<RegisterResponse>> {
  try {
    const body: RegisterRequest = await request.json()
    const { name, email, password } = body

    if (!name || !email || !password) {
      return NextResponse.json({ success: false, message: "Name, email, and password are required" }, { status: 400 })
    }

    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Update profile with name
    await updateProfile(user, { displayName: name })

    // Send email verification
    await sendEmailVerification(user)

    // Create user document in Firestore
    const userData = {
      uid: user.uid,
      displayName: name,
      email: user.email,
      photoURL: user.photoURL || "",
      emailVerified: user.emailVerified,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    }

    await setDoc(doc(db, "users", user.uid), userData)

    // Generate token
    const token = await user.getIdToken()

    return NextResponse.json({
      success: true,
      message: "Registration successful. Please check your email to verify your account.",
      user: userData,
      token,
    })
  } catch (error: any) {
    console.error("Registration error:", error)

    let errorMessage = "Failed to register"
    let statusCode = 500

    if (error.code === "auth/email-already-in-use") {
      errorMessage = "Email is already in use"
      statusCode = 409
    } else if (error.code === "auth/invalid-email") {
      errorMessage = "Invalid email address"
      statusCode = 400
    } else if (error.code === "auth/weak-password") {
      errorMessage = "Password is too weak"
      statusCode = 400
    }

    return NextResponse.json({ success: false, message: errorMessage }, { status: statusCode })
  }
}
