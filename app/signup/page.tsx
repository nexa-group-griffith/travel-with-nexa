'use client';
import { useState, useEffect } from 'react';
import type React from 'react';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { FaGoogle } from 'react-icons/fa';
import { useToast } from '@/hooks/use-toast';
import { authService } from '@/lib/auth-service';
import type { RegisterRequest } from '@/types/auth';
import { addUserDataToLocalStorage } from '@/lib/localstorage';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in
    const user = authService.getCurrentUser();
    if (user) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const registerData: RegisterRequest = {
        name,
        email,
        password,
      };

      const response = await authService.register(registerData);

      if (response.success) {
        setSuccess(true);
        toast({
          title: 'Registration successful',
          description: 'Please check your email to verify your account',
        });
      } else {
        setError(response.message || 'Failed to create account');
        toast({
          title: 'Registration failed',
          description:
            response.message || 'An error occurred during registration',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      setError(error.message || 'Failed to create account');
      toast({
        title: 'Registration error',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    setError(null);

    try {
      // Import Firebase auth components
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
      addUserDataToLocalStorage(userData);

      toast({
        title: 'Sign up successful',
        description: 'You have successfully signed up with Google',
      });

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Google signup error:', error);

      let errorMessage = 'Failed to sign up with Google';

      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Sign up canceled - you closed the popup';
      } else if (error.code === 'auth/unauthorized-domain') {
        errorMessage = 'This domain is not authorized for authentication';
      } else if (
        error.code === 'auth/account-exists-with-different-credential'
      ) {
        errorMessage =
          'An account already exists with the same email address but different sign-in credentials';
      }

      setError(errorMessage);
      toast({
        title: 'Google signup failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className='container flex h-screen items-center justify-center'>
        <Card className='mx-auto w-full max-w-md'>
          <CardHeader className='space-y-1'>
            <CardTitle className='text-2xl'>Registration Successful</CardTitle>
            <CardDescription>
              Please check your email to verify your account
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <Alert>
              <AlertDescription>
                A verification email has been sent to {email}. Please check your
                inbox and spam folder.
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter className='flex flex-col space-y-4'>
            <Button
              asChild
              className='w-full'
            >
              <Link href='/login'>Go to Login</Link>
            </Button>
            <Button
              variant='outline'
              asChild
              className='w-full'
            >
              <Link href='/verify-email'>Resend Verification Email</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className='container flex h-screen items-center justify-center'>
      <Card className='mx-auto w-full max-w-md'>
        <CardHeader className='space-y-1'>
          <CardTitle className='text-2xl'>Create an account</CardTitle>
          <CardDescription>
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          {error && (
            <Alert variant='destructive'>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form
            onSubmit={handleEmailSignup}
            className='space-y-4'
          >
            <div className='space-y-2'>
              <Label htmlFor='name'>Full Name</Label>
              <Input
                id='name'
                placeholder='John Doe'
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                type='email'
                placeholder='name@example.com'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='password'>Password</Label>
              <div className='relative'>
                <Input
                  id='password'
                  type={passwordVisible ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  placeholder='Password'
                />
                <button
                  type='button'
                  onClick={() => setPasswordVisible((prev) => !prev)}
                  className='absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground'
                >
                  {passwordVisible ? (
                    <EyeOff className='h-4 w-4' />
                  ) : (
                    <Eye className='h-4 w-4' />
                  )}
                </button>
              </div>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='confirmPassword'>Confirm Password</Label>
              <div className='relative'>
                <Input
                  id='confirmPassword'
                  type={confirmPasswordVisible ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                  className='pr-10'
                  placeholder='Confirm Password'
                />
                <button
                  type='button'
                  onClick={() => setConfirmPasswordVisible((prev) => !prev)}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground'
                >
                  {confirmPasswordVisible ? (
                    <EyeOff className='h-4 w-4' />
                  ) : (
                    <Eye className='h-4 w-4' />
                  )}
                </button>
              </div>
            </div>

            <Button
              type='submit'
              className='w-full'
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Creating account...
                </>
              ) : (
                'Sign up'
              )}
            </Button>
          </form>
          <div className='relative'>
            <div className='absolute inset-0 flex items-center'>
              <Separator className='w-full' />
            </div>
            <div className='relative flex justify-center text-xs uppercase'>
              <span className='bg-background px-2 text-muted-foreground'>
                Or continue with
              </span>
            </div>
          </div>
          <Button
            variant='outline'
            type='button'
            className='w-full'
            onClick={handleGoogleSignup}
            disabled={loading}
          >
            <FaGoogle
              className='mr-2 h-4 w-4'
              color='#4285F4'
            />{' '}
            Google
          </Button>
        </CardContent>
        <CardFooter className='flex flex-col space-y-4'>
          <p className='text-center text-sm text-muted-foreground'>
            Already have an account?{' '}
            <Link
              href='/login'
              className='font-medium text-primary hover:underline'
            >
              Log in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
