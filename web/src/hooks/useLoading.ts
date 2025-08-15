import { useCallback, useState } from 'react';

interface UseLoadingReturn {
  isLoading: boolean;
  startLoading: (text?: string) => void;
  stopLoading: () => void;
  loadingText: string | undefined;
  withLoading: <T>(fn: () => Promise<T>, text?: string) => Promise<T>;
}

export function useLoading(defaultText?: string): UseLoadingReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState<string | undefined>(defaultText);

  const startLoading = useCallback((text?: string) => {
    setIsLoading(true);
    if (text) setLoadingText(text);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
    setLoadingText(defaultText);
  }, [defaultText]);

  const withLoading = useCallback(
    async <T>(fn: () => Promise<T>, text?: string): Promise<T> => {
      try {
        startLoading(text);
        const result = await fn();
        return result;
      } finally {
        stopLoading();
      }
    },
    [startLoading, stopLoading]
  );

  return {
    isLoading,
    startLoading,
    stopLoading,
    loadingText,
    withLoading,
  };
}
