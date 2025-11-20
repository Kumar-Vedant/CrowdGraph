import { useState, useCallback, useRef, useEffect } from "react";
import type { RouteResponse } from "@/schema/index";

type ApiResponse<T> = {
  success: boolean;
  data: T | null;
  error: string | null;
};

type ApiStatus<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
  callApi: (...args: any[]) => Promise<ApiResponse<T>>;
  reset: () => void;
  isSuccess: boolean;
};

type ApiOptions = {
  retryCount?: number;
  retryDelay?: number;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
};

/**
 * useApi - a robust, reusable hook for handling async API calls with loading, error states, and advanced features
 * @param apiFn - the async function that performs the API request
 * @param options - configuration options for retry logic and callbacks
 */
export function useApi<T>(
  apiFn: (...args: any[]) => Promise<T>,
  options: ApiOptions = {}
): ApiStatus<T> {
  const { retryCount = 0, retryDelay = 1000, onSuccess, onError } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Track component mount status to prevent state updates after unmount
  const isMountedRef = useRef(true);
  // Track the current request to allow cancellation
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      // Cancel any ongoing request when component unmounts
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const reset = useCallback(() => {
    if (isMountedRef.current) {
      setData(null);
      setError(null);
      setLoading(false);
      setIsSuccess(false);
    }
  }, []);

  const callApi = useCallback(
    async (...args: any[]): Promise<ApiResponse<T>> => {
      // Cancel any ongoing request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new AbortController for this request
      abortControllerRef.current = new AbortController();

      if (!isMountedRef.current) return { success: false, data: null, error: "Component unmounted" };

      setLoading(true);
      setError(null);
      setIsSuccess(false);

      let lastError: string | null = null;
      let attempts = 0;

      while (attempts <= retryCount) {
        try {
          const response = await apiFn(...args);
          // Check if component is still mounted
          if (!isMountedRef.current) return { success: false, data: null, error: "Component unmounted" };

          // Check if response has a success attribute (RouteResponse pattern)
          if (
            typeof response === "object" &&
            response !== null &&
            "success" in response
          ) {
            const apiResponse = response as RouteResponse<T>;

            if (apiResponse.success) {
              // Extract data if success is true
              const responseData = apiResponse.data || null;
              setData(responseData);
              setError(null);
              setIsSuccess(true);
              setLoading(false);

              // Call success callback if provided
              if (onSuccess && responseData) {
                try {
                  onSuccess(responseData);
                } catch (callbackErr) {
                  console.error("Error in onSuccess callback:", callbackErr);
                }
              }

              return { success: true, data: responseData, error: null };
            } else {
              // API returned success: false
              lastError = apiResponse.error || "Request failed";

              // Don't retry on explicit API failures (like validation errors)
              if (isMountedRef.current) {
                setError(lastError);
                setData(null);
                setIsSuccess(false);
                setLoading(false);

                if (onError && lastError) {
                  try {
                    onError(lastError);
                  } catch (callbackErr) {
                    console.error("Error in onError callback:", callbackErr);
                  }
                }
              }

              return { success: false, data: null, error: lastError };
            }
          } else {
            // If no success attribute, use the response as is (backward compatibility)
            setData(response);
            setError(null);
            setIsSuccess(true);
            setLoading(false);

            if (onSuccess) {
              try {
                onSuccess(response);
              } catch (callbackErr) {
                console.error("Error in onSuccess callback:", callbackErr);
              }
            }

            return { success: true, data: response, error: null };
          }
        } catch (err: any) {
          // Handle abort errors (don't retry)
          if (err.name === "AbortError" || err.message === "canceled") {
            if (isMountedRef.current) {
              setLoading(false);
            }
            return { success: false, data: null, error: "Request canceled" };
          }

          // Network or other errors - attempt retry
          lastError = err?.message || "Network error occurred";
          attempts++;

          // If we've exhausted retries, set the error
          if (attempts > retryCount) {
            if (isMountedRef.current) {
              setError(lastError);
              setData(null);
              setIsSuccess(false);
              setLoading(false);

              if (onError) {
                try {
                  onError(lastError);
                } catch (callbackErr) {
                  console.error("Error in onError callback:", callbackErr);
                }
              }
            }
            
            return { success: false, data: null, error: lastError };
          }

          // Wait before retrying
          if (attempts <= retryCount) {
            await new Promise((resolve) =>
              setTimeout(resolve, retryDelay * attempts)
            );
          }
        }
      }

      // Fallback (should never reach here)
      const fallbackError = lastError || "Unknown error occurred";
      if (isMountedRef.current) {
        setError(fallbackError);
        setData(null);
        setIsSuccess(false);
        setLoading(false);
      }

      return { success: false, data: null, error: fallbackError };
    },
    [apiFn, retryCount, retryDelay, onSuccess, onError]
  );  return { data, loading, error, callApi, reset, isSuccess };
}
