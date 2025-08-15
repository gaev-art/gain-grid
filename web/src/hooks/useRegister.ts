'use client';

import type { RegisterFormData } from '@/lib/forms/register-schema';
import { authService, type AuthResult } from '@/lib/services';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

interface RegistrationError {
  message: string;
  code?: string;
}

interface UseRegisterReturn {
  register: (data: RegisterFormData) => Promise<void>;
  isLoading: boolean;
  error: RegistrationError | null;
  clearError: () => void;
}

export function useRegister(): UseRegisterReturn {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<RegistrationError | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const register = useCallback(
    async (data: RegisterFormData) => {
      setIsLoading(true);
      setError(null);

      try {
        const result: AuthResult = await authService.register(data);

        if (!result.success) {
          setError({
            message: result.error || 'Registration failed',
            code: 'REGISTRATION_ERROR',
          });
          return;
        }

        router.push('/auth/login?message=Registration successful! Please sign in.');
      } catch (error) {
        setError({
          message: error instanceof Error ? error.message : 'An unexpected error occurred',
          code: 'UNKNOWN_ERROR',
        });
      } finally {
        setIsLoading(false);
      }
    },
    [router]
  );

  return {
    register,
    isLoading,
    error,
    clearError,
  };
}
