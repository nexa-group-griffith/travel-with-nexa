'use client';

import type React from 'react';
import { createContext, useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, type User } from 'firebase/auth';
import {
  addUserDataToLocalStorage,
  removeUserDataFromLocalStorage,
} from './localstorage';
import Cookies from 'js-cookie';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    console.log('Auth provider initialized, checking auth state...');

    if (!auth) {
      console.error('Firebase auth not initialized');
      setLoading(false);
      setError(
        'Firebase authentication is not initialized. Please check your environment variables.'
      );
      return;
    }

    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        if (isMounted) {
          console.log('Auth state changed:', user);
          if (user) {
            console.log(
              'User authenticated:',
              user.email,
              'Email verified:',
              user.emailVerified
            );

            // Set the user regardless of email verification status
            setUser(user);
            addUserDataToLocalStorage(user);

            try {
              const token = await user.getIdToken();
              Cookies.set('auth-token', token, { expires: 7 });
              console.log('Token set successfully');
            } catch (err) {
              console.error('Error fetching token:', err);
              toast({
                title: 'Please connect to the network',
                variant: 'destructive',
              });
              setError('Error fetching token.');
            }

            // Show a warning if email is not verified, but don't sign them out
            if (!user.emailVerified) {
              console.warn('User email not verified:', user.email);
              toast({
                title: 'Email not verified',
                description:
                  'Please check your email to verify your account for full access.',
                variant: 'destructive',
              });
            }
          } else {
            setUser(null);
            Cookies.remove('auth-token');
            removeUserDataFromLocalStorage();
          }

          setLoading(false);
        }
      },
      (error) => {
        if (isMounted) {
          console.error('Auth state change error:', error);
          setError('Authentication error: ' + error.message);
          setLoading(false);
        }
        Cookies.remove('auth-token');
        removeUserDataFromLocalStorage();
      }
    );

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
}
