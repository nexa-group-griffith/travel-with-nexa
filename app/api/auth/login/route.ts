import { type NextRequest, NextResponse } from 'next/server';
import type { LoginRequest, LoginResponse } from '@/types/auth';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export async function POST(
  request: NextRequest
): Promise<NextResponse<LoginResponse>> {
  try {
    const body: LoginRequest = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: 'Email and password are required',
          user: {} as any,
          token: '',
        },
        { status: 400 }
      );
    }

    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    if (!user.emailVerified) {
      console.warn(`User ${user.email} logged in with unverified email`);
    }

    const userDoc = await getDoc(doc(db, 'users', user.uid));
    const userData = userDoc.exists() ? userDoc.data() : {};

    const token = await user.getIdToken(true); // Force refresh the token

    const { getAuth } = await import('firebase-admin/auth');
    const adminAuth = getAuth();
    const customToken = await adminAuth.createCustomToken(user.uid);

    await updateDoc(doc(db, 'users', user.uid), {
      lastLoginAt: new Date().toISOString(),
    }).catch((err) => console.error('Error updating last login:', err));

    return NextResponse.json({
      success: true,
      user: {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || userData.displayName || '',
        photoURL: user.photoURL || userData.photoURL || '',
        emailVerified: user.emailVerified,
        createdAt: userData.createdAt || new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        bio: userData.bio || '',
        location: userData.location || '',
        phoneNumber: userData.phoneNumber || '',
      },
      token: customToken,
    });
  } catch (error: any) {
    console.error('Login error:', error);

    let errorMessage = 'Failed to log in';
    let statusCode = 500;

    if (error.code === 'auth/invalid-credential') {
      errorMessage = 'Invalid email or password';
      statusCode = 401;
    } else if (error.code === 'auth/user-not-found') {
      errorMessage = 'User not found';
      statusCode = 404;
    } else if (error.code === 'auth/wrong-password') {
      errorMessage = 'Invalid password';
      statusCode = 401;
    } else if (error.code === 'auth/too-many-requests') {
      errorMessage = 'Too many failed login attempts. Please try again later';
      statusCode = 429;
    }

    return NextResponse.json(
      { success: false, message: errorMessage, user: {} as any, token: '' },
      { status: statusCode }
    );
  }
}
