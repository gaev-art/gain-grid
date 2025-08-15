'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { FormField } from '@/components/ui/form-field';
import { LoadingButton } from '@/components/ui/loading-button';
import { loginSchema, type LoginFormData } from '@/lib/forms/login-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { memo, useCallback } from 'react';
import { useForm } from 'react-hook-form';

interface EmailPasswordFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>;
  error: { message: string } | null;
  isLoading: boolean;
}

function EmailPasswordFormComponent({ onSubmit, error, isLoading }: EmailPasswordFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const handleFormSubmit = useCallback(
    async (data: LoginFormData) => {
      await onSubmit(data);
    },
    [onSubmit]
  );

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}

      <FormField
        label="Email"
        type="email"
        id="email"
        placeholder="Enter your email"
        error={errors.email?.message}
        disabled={isLoading}
        {...register('email')}
      />

      <FormField
        label="Password"
        type="password"
        id="password"
        placeholder="Enter your password"
        error={errors.password?.message}
        disabled={isLoading}
        {...register('password')}
      />

      <LoadingButton
        type="submit"
        className="w-full"
        isLoading={isLoading}
        loadingText="Signing in..."
      >
        Sign in
      </LoadingButton>
    </form>
  );
}

export const EmailPasswordForm = memo(EmailPasswordFormComponent);
