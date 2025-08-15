'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { SimpleButton } from '@/components/ui/simple-button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Loading...</h2>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">
              Welcome back, {session.user?.name || session.user?.email}!
            </p>
          </div>
          <SimpleButton onClick={() => signOut({ callbackUrl: '/auth/login' })} variant="outline">
            Sign Out
          </SimpleButton>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Workouts</CardTitle>
              <CardDescription>Your latest fitness activities</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">No workouts yet. Start your fitness journey!</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Progress</CardTitle>
              <CardDescription>Track your fitness goals</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Set your first goal to see progress here.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <SimpleButton className="w-full" variant="outline">
                Start Workout
              </SimpleButton>
              <SimpleButton className="w-full" variant="outline">
                View History
              </SimpleButton>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
