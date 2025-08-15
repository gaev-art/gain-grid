/// <reference types="node" />

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiRequestConfig {
  headers?: Record<string, string>;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

export interface ApiServiceConfig {
  baseUrl?: string;
  defaultHeaders?: Record<string, string>;
  defaultTimeout?: number;
  defaultRetries?: number;
  defaultRetryDelay?: number;
}

export class ApiService {
  private config: Required<ApiServiceConfig>;

  constructor(config: Partial<ApiServiceConfig> = {}) {
    this.config = {
      baseUrl: config.baseUrl || '',
      defaultHeaders: {
        'Content-Type': 'application/json',
        ...config.defaultHeaders,
      },
      defaultTimeout: config.defaultTimeout || 10000,
      defaultRetries: config.defaultRetries || 3,
      defaultRetryDelay: config.defaultRetries || 1000,
    };
  }

  private async makeRequest<T>(
    endpoint: string,
    options: globalThis.RequestInit & { config?: ApiRequestConfig } = {}
  ): Promise<ApiResponse<T>> {
    const { config: requestConfig, ...fetchOptions } = options;
    const url = this.config.baseUrl + endpoint;

    const headers = {
      ...this.config.defaultHeaders,
      ...fetchOptions.headers,
      ...requestConfig?.headers,
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      requestConfig?.timeout || this.config.defaultTimeout
    );

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: errorData.message || `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          return { success: false, error: 'Request timeout' };
        }
        return { success: false, error: error.message };
      }

      return { success: false, error: 'Unknown error occurred' };
    }
  }

  private async retryRequest<T>(
    endpoint: string,
    options: globalThis.RequestInit & { config?: ApiRequestConfig } = {},
    retryCount = 0
  ): Promise<ApiResponse<T>> {
    try {
      return await this.makeRequest<T>(endpoint, options);
    } catch {
      const maxRetries = options.config?.retries || this.config.defaultRetries;

      if (retryCount < maxRetries) {
        const delay = options.config?.retryDelay || this.config.defaultRetryDelay;
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.retryRequest(endpoint, options, retryCount + 1);
      }

      return { success: false, error: 'Max retries exceeded' };
    }
  }

  async get<T>(endpoint: string, config?: ApiRequestConfig): Promise<ApiResponse<T>> {
    return this.retryRequest<T>(endpoint, { method: 'GET', config });
  }

  async post<T>(endpoint: string, data: any, config?: ApiRequestConfig): Promise<ApiResponse<T>> {
    return this.retryRequest<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      config,
    });
  }

  async put<T>(endpoint: string, data: any, config?: ApiRequestConfig): Promise<ApiResponse<T>> {
    return this.retryRequest<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      config,
    });
  }

  async patch<T>(endpoint: string, data: any, config?: ApiRequestConfig): Promise<ApiResponse<T>> {
    return this.retryRequest<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
      config,
    });
  }

  async delete<T>(endpoint: string, config?: ApiRequestConfig): Promise<ApiResponse<T>> {
    return this.retryRequest<T>(endpoint, { method: 'DELETE', config });
  }

  setAuthToken(token: string) {
    this.config.defaultHeaders.Authorization = `Bearer ${token}`;
  }

  removeAuthToken() {
    delete this.config.defaultHeaders.Authorization;
  }

  setBaseUrl(url: string) {
    this.config.baseUrl = url;
  }
}

// Singleton instance
export const apiService = new ApiService();
