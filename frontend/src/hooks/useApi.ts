import { useState, useEffect, useCallback, useRef } from 'react';

interface UseApiOptions<T> {
  url: string;
  initialData?: T | null;
  cacheTime?: number;
  retryAttempts?: number;
  retryDelay?: number;
  enabled?: boolean;
}

interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  retryCount: number;
}

// Cache storage
const cache = new Map<string, { data: any; timestamp: number }>();

export function useApi<T>({
  url,
  initialData = null as T | null,
  cacheTime = 5 * 60 * 1000, // 5 minutes
  retryAttempts = 3,
  retryDelay = 1000,
  enabled = true
}: UseApiOptions<T>): UseApiResult<T> {
  const [data, setData] = useState<T | null>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async (attempt = 1): Promise<void> => {
    if (!enabled) return;

    // Check cache first
    const cached = cache.get(url);
    if (cached && Date.now() - cached.timestamp < cacheTime) {
      setData(cached.data);
      setError(null);
      return;
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(url, {
        signal: abortControllerRef.current.signal,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const result = await response.json();

      // Validate response
      if (!result) {
        throw new Error('Invalid response format');
      }

      // Cache the result
      cache.set(url, {
        data: result,
        timestamp: Date.now()
      });

      setData(result);
      setRetryCount(0);

    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return; // Request was cancelled
      }

      console.error(`API Error (attempt ${attempt}):`, err);
      
      if (attempt < retryAttempts) {
        setRetryCount(attempt);
        const delay = retryDelay * Math.pow(2, attempt - 1); // Exponential backoff
        setTimeout(() => {
          fetchData(attempt + 1);
        }, delay);
      } else {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setRetryCount(0);
      }
    } finally {
      setLoading(false);
    }
  }, [url, cacheTime, retryAttempts, retryDelay, enabled]);

  const refetch = useCallback(() => {
    // Clear cache for this URL
    cache.delete(url);
    setRetryCount(0);
    fetchData();
  }, [url, fetchData]);

  useEffect(() => {
    fetchData();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch,
    retryCount
  };
}

// Utility function to clear cache
export const clearApiCache = (url?: string) => {
  if (url) {
    cache.delete(url);
  } else {
    cache.clear();
  }
}; 