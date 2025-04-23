import { apiClient } from './api-client';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
  UserData,
} from '@/types/auth';
import {
  getUserDataFromLocalStorage,
  removeUserDataFromLocalStorage,
} from './localstorage';

export const authService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    try {
      const response = await apiClient.post<LoginResponse>(
        '/api/auth/login',
        data
      );

      if (response.success && response.data && response.data.token) {
        // Store token in localStorage
        localStorage.setItem('auth-token', response.data.token);

        // Store user data
        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
      }

      return (
        response.data || {
          success: response.success,
          message: response.message,
          user: {} as UserData,
          token: '',
        }
      );
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: (error as Error).message || 'Failed to login',
        user: {} as UserData,
        token: '',
      };
    }
  },

  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    try {
      const response = await apiClient.post<RegisterResponse>(
        '/api/auth/register',
        data
      );

      if (response.success && response.data && response.data.token) {
        // Store token in localStorage
        localStorage.setItem('auth-token', response.data.token);

        // Store user data
        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
      }

      return (
        response.data || {
          success: response.success,
          message: response.message || '',
        }
      );
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: (error as Error).message || 'Failed to register',
      };
    }
  },

  forgotPassword: async (
    data: ForgotPasswordRequest
  ): Promise<ForgotPasswordResponse> => {
    try {
      const response = await apiClient.post<ForgotPasswordResponse>(
        '/api/auth/forgot-password',
        data
      );

      return (
        response.data || {
          success: response.success,
          message: response.message || 'Password reset email sent',
        }
      );
    } catch (error) {
      console.error('Forgot password error:', error);
      return {
        success: false,
        message:
          (error as Error).message ||
          'Failed to process forgot password request',
      };
    }
  },

  resetPassword: async (
    data: ResetPasswordRequest
  ): Promise<ResetPasswordResponse> => {
    try {
      const response = await apiClient.post<ResetPasswordResponse>(
        '/api/auth/reset-password',
        data
      );

      return (
        response.data || {
          success: response.success,
          message: response.message || 'Password reset successful',
        }
      );
    } catch (error) {
      console.error('Reset password error:', error);
      return {
        success: false,
        message: (error as Error).message || 'Failed to reset password',
      };
    }
  },

  verifyEmail: async (
    data: VerifyEmailRequest
  ): Promise<VerifyEmailResponse> => {
    try {
      const response = await apiClient.post<VerifyEmailResponse>(
        '/api/auth/verify-email',
        data
      );

      return (
        response.data || {
          success: response.success,
          message: response.message || 'Email verification successful',
        }
      );
    } catch (error) {
      console.error('Verify email error:', error);
      return {
        success: false,
        message: (error as Error).message || 'Failed to verify email',
      };
    }
  },

  logout: async (): Promise<void> => {
    try {
      await apiClient.post<{ success: boolean }>('/api/auth/logout', {});
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local storage on logout
      localStorage.removeItem('auth-token');
      removeUserDataFromLocalStorage();
    }
  },

  getCurrentUser: (): UserData | null => {
    if (typeof window === 'undefined') {
      return null;
    }

    const userJson = getUserDataFromLocalStorage();
    if (!userJson) {
      return null;
    }

    try {
      return userJson as UserData;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  },

  loginWithGoogle: async (): Promise<LoginResponse> => {
    try {
      const { GoogleAuthProvider, signInWithPopup } = await import(
        'firebase/auth'
      );
      const { doc, setDoc, getDoc } = await import('firebase/firestore');
      const { auth, db } = await import('@/lib/firebase');

      // Create Google auth provider
      const provider = new GoogleAuthProvider();

      // Sign in with popup
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user already exists in Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));

      // Create or update user document
      const userData = {
        uid: user.uid,
        displayName: user.displayName || '',
        email: user.email || '',
        photoURL: user.photoURL || '',
        emailVerified: user.emailVerified,
        createdAt: userDoc.exists()
          ? userDoc.data().createdAt
          : new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      };

      await setDoc(doc(db, 'users', user.uid), userData, { merge: true });

      // Store token in localStorage
      const token = await user.getIdToken();
      localStorage.setItem('auth-token', token);
      localStorage.setItem('user', JSON.stringify(userData));

      return {
        success: true,
        user: userData as UserData,
        token,
      };
    } catch (error: any) {
      console.error('Google login error:', error);
      return {
        success: false,
        message: error.message || 'Failed to login with Google',
        user: {} as UserData,
        token: '',
      };
    }
  },
};
