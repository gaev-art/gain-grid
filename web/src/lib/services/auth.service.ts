import type { LoginFormData, RegisterFormData } from '@/lib/forms';
import { getSession, signIn, signOut } from 'next-auth/react';

export interface AuthResult {
  success: boolean;
  error?: string;
  user?: any;
}

export interface AuthServiceConfig {
  redirectUrl?: string;
  errorRedirectUrl?: string;
}

export class AuthService {
  private config: AuthServiceConfig;

  constructor(config: AuthServiceConfig = {}) {
    this.config = {
      redirectUrl: '/dashboard',
      errorRedirectUrl: '/auth/login',
      ...config,
    };
  }

  async login(credentials: LoginFormData): Promise<AuthResult> {
    try {
      const result = await signIn('credentials', {
        ...credentials,
        redirect: false,
      });

      if (result?.error) {
        return {
          success: false,
          error: this.mapAuthError(result.error),
        };
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Authentication failed',
      };
    }
  }

  async loginWithGoogle(): Promise<AuthResult> {
    try {
      const result = await signIn('google', {
        callbackUrl: this.config.redirectUrl,
        redirect: false,
      });

      if (result?.error) {
        return {
          success: false,
          error: this.mapAuthError(result.error),
        };
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Google authentication failed',
      };
    }
  }

  async register(userData: RegisterFormData): Promise<AuthResult> {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || 'Registration failed',
        };
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Registration failed',
      };
    }
  }

  async logout(): Promise<AuthResult> {
    try {
      await signOut({ redirect: false });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Logout failed',
      };
    }
  }

  async getCurrentUser() {
    try {
      const session = await getSession();
      return session?.user || null;
    } catch {
      return null;
    }
  }

  async isAuthenticated(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return !!user;
  }

  private mapAuthError(error: string): string {
    const errorMap: Record<string, string> = {
      CredentialsSignin: 'Invalid email or password',
      AccessDenied: 'Access denied',
      Verification: 'Verification failed',
      Configuration: 'Server configuration error',
      OAuthSignin: 'OAuth sign in failed',
      OAuthCallback: 'OAuth callback failed',
      OAuthCreateAccount: 'OAuth account creation failed',
      EmailCreateAccount: 'Email account creation failed',
      Callback: 'Authentication callback failed',
    };

    return errorMap[error] || 'Authentication failed';
  }
}

// Singleton instance
export const authService = new AuthService();
