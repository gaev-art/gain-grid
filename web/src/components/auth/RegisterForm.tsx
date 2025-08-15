'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SimpleButton } from '@/components/ui/simple-button';
import { useAuth } from '@/hooks/useAuth';
import { useRegister } from '@/hooks/useRegister';
import { registerSchema, type RegisterFormData } from '@/lib/forms/register-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { AuthCard } from './AuthCard';
import { SocialButtons } from './SocialButtons';

export function RegisterForm() {
  const { signInWithGoogle, error: authError } = useAuth();
  const { register: registerUser, isLoading, error: registrationError, clearError } = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    clearError();
    await registerUser(data);
  };

  return (
    <AuthCard title="Create account" description="Enter your information to create a new account">
      <div className="space-y-4">
        <SocialButtons onGoogleSignIn={signInWithGoogle} isLoading={!!authError} />

        {authError && (
          <Alert variant="destructive">
            <AlertDescription>{authError.message}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {registrationError && (
            <Alert variant="destructive">
              <AlertDescription>{registrationError.message}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-1">
            <Label htmlFor="name" className="text-sm font-medium">
              Name
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your name"
              className="w-full"
              autoComplete="name"
              {...register('name')}
              disabled={isLoading}
            />
            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="email" className="text-sm font-medium">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="w-full"
              autoComplete="email"
              {...register('email')}
              disabled={isLoading}
            />
            {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Create a password"
              className="w-full"
              autoComplete="new-password"
              {...register('password')}
              disabled={isLoading}
            />
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="confirmPassword" className="text-sm font-medium">
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              className="w-full"
              autoComplete="new-password"
              {...register('confirmPassword')}
              disabled={isLoading}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-500 mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          <SimpleButton type="submit" className="w-full py-2 mt-2" disabled={isLoading}>
            {isLoading ? 'Creating account...' : 'Create account'}
          </SimpleButton>
        </form>
      </div>
    </AuthCard>
  );
}
