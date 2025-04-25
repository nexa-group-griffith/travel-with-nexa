export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  user: UserData
  token: string
  success: boolean
  message?: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export interface RegisterResponse {
  success: boolean
  message: string
  user?: UserData
  token?: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ForgotPasswordResponse {
  success: boolean
  message: string
}

export interface ResetPasswordRequest {
  token: string
  password: string
  confirmPassword: string
}

export interface ResetPasswordResponse {
  success: boolean
  message: string
}

export interface VerifyEmailRequest {
  token: string
}

export interface VerifyEmailResponse {
  success: boolean
  message: string
}

export interface UserData {
  uid: string
  email: string
  displayName?: string
  photoURL?: string
  emailVerified: boolean
  createdAt: string
  lastLoginAt?: string
  bio?: string
  location?: string
  phoneNumber?: string
}
