'use client';

import type { LoginFormData } from '@/lib/forms/login-schema';
import { authService, type AuthResult } from '@/lib/services';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

interface AuthError {
  message: string;
  code?: string;
}

export function useAuth() {
  const router = useRouter();
  const { data: session } = useSession();
  const [error, setError] = useState<AuthError | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const signIn = useCallback(
    async (credentials: LoginFormData) => {
      try {
        const result: AuthResult = await authService.login(credentials);

        if (!result.success) {
          setError({
            message: result.error || 'Authentication failed',
            code: 'AUTH_ERROR',
          });
          return;
        }

        router.push('/dashboard');
        router.refresh();
      } catch (error) {
        setError({
          message: error instanceof Error ? error.message : 'An unexpected error occurred',
          code: error instanceof Error ? error.name : 'UNKNOWN_ERROR',
        });
      }
    },
    [router]
  );

  const signInWithGoogle = useCallback(async () => {
    try {
      const result: AuthResult = await authService.loginWithGoogle();

      if (!result.success) {
        setError({
          message: result.error || 'Google authentication failed',
          code: 'GOOGLE_AUTH_ERROR',
        });
        return;
      }

      router.push('/dashboard');
      router.refresh();
    } catch (error) {
      setError({
        message:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred during Google sign in',
        code: error instanceof Error ? error.name : 'GOOGLE_AUTH_ERROR',
      });
    }
  }, [router]);

  const signOut = useCallback(async () => {
    try {
      const result: AuthResult = await authService.logout();

      if (result.success) {
        router.push('/auth/login');
        router.refresh();
      } else {
        setError({
          message: result.error || 'Logout failed',
          code: 'LOGOUT_ERROR',
        });
      }
    } catch (error) {
      setError({
        message:
          error instanceof Error ? error.message : 'An unexpected error occurred during logout',
        code: error instanceof Error ? error.name : 'LOGOUT_ERROR',
      });
    }
  }, [router]);

  return {
    user: session?.user ?? null,
    error,
    clearError,
    signIn,
    signInWithGoogle,
    signOut,
  };
}
