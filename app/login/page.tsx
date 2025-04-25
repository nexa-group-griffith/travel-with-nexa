'use client';
import { useState, useEffect } from 'react';
import type React from 'react';

import { useRouter, useSearchParams } from 'next/navigation';
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
import type { LoginRequest } from '@/types/auth';
import { addUserDataToLocalStorage } from '@/lib/localstorage';

export default function LoginPage() {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/dashboard';
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const user = authService.getCurrentUser();
    if (user) {
      router.push(redirectPath);
    }
  }, [router, redirectPath]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const loginData: LoginRequest = {
        email,
        password,
      };

      const response = await authService.login(loginData);

      if (response.success) {
        toast({
          title: 'Login successful',
          description: 'Welcome back!',
        });
        router.push('/dashboard');
      } else {
        setError(response.message || 'Failed to log in');
        toast({
          title: 'Login failed',
          description: response.message || 'Invalid email or password',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      setError(error.message || 'Failed to log in');
      toast({
        title: 'Login error',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      // Import Firebase auth components
      const { GoogleAuthProvider, signInWithPopup } = await import(
        'firebase/auth'
      );
      const { doc, setDoc, getDoc } = await import('firebase/firestore');
      const { auth, db } = await import('@/lib/firebase');

      const provider = new GoogleAuthProvider();

      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userDoc = await getDoc(doc(db, 'users', user.uid));

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

      const token = await user.getIdToken();
      localStorage.setItem('auth-token', token);
      addUserDataToLocalStorage(userData);

      toast({
        title: 'Login successful',
        description: 'Welcome back!',
      });

      router.push(redirectPath);
    } catch (error: any) {
      console.error('Google login error:', error);

      let errorMessage = 'Failed to log in with Google';

      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Login canceled - you closed the popup';
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
        title: 'Google login failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='container flex h-screen items-center justify-center'>
      <Card className='mx-auto w-full max-w-md'>
        <CardHeader className='space-y-1'>
          <CardTitle className='text-2xl'>Log in to your account</CardTitle>
          <CardDescription>
            Enter your email and password to log in
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          {error && (
            <Alert variant='destructive'>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form
            onSubmit={handleEmailLogin}
            className='space-y-4'
          >
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
              <div className='flex items-center justify-between'>
                <Label htmlFor='password'>Password</Label>
                <Link
                  href='/forgot-password'
                  className='text-sm font-medium text-primary hover:underline'
                >
                  Forgot password?
                </Link>
              </div>
              <div className='space-y-2'>
                <div className='relative'>
                  <Input
                    id='password'
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    placeholder='Password'
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword((prev) => !prev)}
                    className='absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground'
                  >
                    {showPassword ? (
                      <EyeOff className='h-4 w-4' />
                    ) : (
                      <Eye className='h-4 w-4' />
                    )}
                  </button>
                </div>
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
                  Logging in...
                </>
              ) : (
                'Log in'
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
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <FaGoogle
              className='mr-2 h-4 w-4'
              color='#4285F4'
            />{' '}
            Google
          </Button>
        </CardContent>
        <CardFooter className='flex flex-col space-y-6'>
          <p className='text-center text-sm text-muted-foreground'>
            Don&apos;t have an account?{' '}
            <Link
              href='/signup'
              className='font-medium text-primary hover:underline'
            >
              Sign up
            </Link>
          </p>
          <p className='text-center text-sm text-muted-foreground'>
            Didn&apos;t receive a verification email?{' '}
            <Link
              href='/verify-email'
              className='font-medium text-primary hover:underline'
            >
              Verify your email
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
