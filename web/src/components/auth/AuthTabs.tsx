'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

export function AuthTabs() {
  return (
    <Tabs defaultValue="login" className="w-full max-w-md mx-auto">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login">Sign In</TabsTrigger>
        <TabsTrigger value="register">Sign Up</TabsTrigger>
      </TabsList>

      <TabsContent value="login" className="mt-6">
        <LoginForm />
      </TabsContent>

      <TabsContent value="register" className="mt-6">
        <RegisterForm />
      </TabsContent>
    </Tabs>
  );
}
