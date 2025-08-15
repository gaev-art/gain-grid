'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SimpleButton } from '@/components/ui/simple-button';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const error = searchParams.get('error');

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case 'AccessDenied':
        return 'You do not have permission to access this resource.';
      case 'Verification':
        return 'The verification link is invalid or has expired.';
      case 'Configuration':
        return 'There is a problem with the server configuration.';
      case 'OAuthSignin':
        return 'Error occurred during OAuth sign in.';
      case 'OAuthCallback':
        return 'Error occurred during OAuth callback.';
      case 'OAuthCreateAccount':
        return 'Could not create OAuth account.';
      case 'EmailCreateAccount':
        return 'Could not create email account.';
      case 'Callback':
        return 'Error occurred during authentication callback.';
      default:
        return 'An unexpected authentication error occurred.';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Authentication Error</CardTitle>
          <CardDescription className="text-center">{getErrorMessage(error)}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SimpleButton className="w-full" onClick={() => router.push('/auth/login')}>
            Return to Login
          </SimpleButton>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Loading...</CardTitle>
            </CardHeader>
          </Card>
        </div>
      }
    >
      <AuthErrorContent />
    </Suspense>
  );
}
