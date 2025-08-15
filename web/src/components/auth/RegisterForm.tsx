'use client';

import { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SimpleButton } from '@/components/ui/simple-button';
import { registerSchema, type RegisterFormData } from '@/lib/forms/register-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { signIn, getSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { AuthCard } from './AuthCard';

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showGooglePopup, setShowGooglePopup] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  // Check session status after Google OAuth
  useEffect(() => {
    if (showGooglePopup) {
      const checkSession = async () => {
        try {
          const session = await getSession();
          if (session) {
            setShowGooglePopup(false);
            router.push('/dashboard');
            router.refresh();
          }
        } catch (error) {
          console.error('Session check error:', error);
        }
      };

      // Check session every 2 seconds while popup is open
      const interval = setInterval(checkSession, 2000);

      // Cleanup interval
      return () => clearInterval(interval);
    }
  }, [showGooglePopup, router]);

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          confirmPassword: data.confirmPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'Registration failed');
        return;
      }

      // Redirect to login page after successful registration
      router.push('/auth/login?message=Registration successful! Please sign in.');
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setError(null);
    setShowGooglePopup(true);

    try {
      // Use popup approach for better UX
      const result = await signIn('google', {
        callbackUrl: '/dashboard',
        redirect: false,
      });

      if (result?.error) {
        setError('Google sign in failed. Please try again.');
        setShowGooglePopup(false);
        setIsGoogleLoading(false);
        return;
      }

      // If no immediate error, keep popup open and check session
      // The useEffect will handle the redirect when session is available
    } catch (error) {
      setError('An unexpected error occurred during Google sign in');
      setShowGooglePopup(false);
      setIsGoogleLoading(false);
    }
  };

  return (
    <AuthCard title="Create account" description="Enter your information to create a new account">
      <div className="space-y-4">
        {/* Google Sign In Button */}
        <SimpleButton
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading || isLoading}
        >
          {isGoogleLoading ? (
            'Opening Google...'
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </>
          )}
        </SimpleButton>

        {/* Google OAuth Status */}
        {showGooglePopup && (
          <Alert>
            <AlertDescription>
              Google sign-in popup opened. If you don't see it, check your popup blocker or try
              again.
            </AlertDescription>
          </Alert>
        )}

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>

        {/* Existing Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your name"
              {...register('name')}
              disabled={isLoading || isGoogleLoading}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              {...register('email')}
              disabled={isLoading || isGoogleLoading}
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Create a password"
              {...register('password')}
              disabled={isLoading || isGoogleLoading}
            />
            {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              {...register('confirmPassword')}
              disabled={isLoading || isGoogleLoading}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
            )}
          </div>

          <SimpleButton type="submit" className="w-full" disabled={isLoading || isGoogleLoading}>
            {isLoading ? 'Creating account...' : 'Create account'}
          </SimpleButton>
        </form>
      </div>
    </AuthCard>
  );
}
