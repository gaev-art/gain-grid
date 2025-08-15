'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

export function AuthTabs() {
  const [tab, setTab] = useState('login');

  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md text-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">GainGrid</h1>
        <p className="mt-1.5 text-base text-gray-600">Your fitness journey starts here</p>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="w-full max-w-md">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="login">Sign In</TabsTrigger>
          <TabsTrigger value="register">Sign Up</TabsTrigger>
        </TabsList>

        <div className="relative min-h-[450px]">
          <AnimatePresence mode="wait" initial={false}>
            {tab === 'login' && (
              <TabsContent key="login" value="login" className="absolute w-full">
                <LoginForm />
              </TabsContent>
            )}

            {tab === 'register' && (
              <TabsContent key="register" value="register" className="absolute w-full">
                <RegisterForm />
              </TabsContent>
            )}
          </AnimatePresence>
        </div>
      </Tabs>
    </div>
  );
}
