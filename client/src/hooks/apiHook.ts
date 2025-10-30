import { useState, useCallback } from "react";

type ApiStatus<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
  callApi: (...args: any[]) => Promise<void>;
};

/**
 * useApi - a reusable hook for handling async API calls with loading and error states
 * @param apiFn - the async function that performs the API request
 */
export function useApi<T>(apiFn: (...args: any[]) => Promise<T>): ApiStatus<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callApi = useCallback(async (...args: any[]) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiFn(...args);
      setData(response);
    } catch (err: any) {
      setError(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [apiFn]);

  return { data, loading, error, callApi };
}
