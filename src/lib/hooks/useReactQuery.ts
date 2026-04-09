'use client';
import { useState } from 'react';
import { QueryClient, useQuery as useTanQuery } from '@tanstack/react-query';

import axios from '@/lib/axios';
import { ErrorType } from '@/schema';

export type ParamsType = Record<string, any>;

export interface UseReactQueryProps {
  uri: string;
  enabled?: boolean;
  queryKey?: string[];
  params?: ParamsType;
  // Cache and refetch configurations
  cacheTime?: number; // Time in milliseconds (default: 5 minutes)
  staleTime?: number; // Time in milliseconds (default: 0)
  refetchInterval?: number; // Time in milliseconds for auto-refetch
  refetchOnMount?: boolean | 'always';
  refetchOnWindowFocus?: boolean;
  refetchOnReconnect?: boolean;
}

export interface UseReactQueryValue<T> {
  loading: boolean;
  data: T;
  hasCachedData: boolean;
  error: ErrorType | null;
  fetchData: (uri?: string) => Promise<T>;
}

const handleRequest = async (uri: string, params?: ParamsType) => {
  const response = await axios.get(uri, { params });
  return response;
};

export const useReactQuery = <T>({
  uri,
  params,
  queryKey,
  enabled = true,
  cacheTime = 3600000, // Default 60 minutes cache
  staleTime = 0, // Immediate stale by default
  refetchInterval,
  refetchOnMount = false,
  refetchOnWindowFocus = false,
  refetchOnReconnect = true,
}: UseReactQueryProps): UseReactQueryValue<T> => {
  const [url, setUrl] = useState(uri || '');
  const [fetching, setFetching] = useState<boolean>(false);
  // Access the QueryClient instance
  const queryClient = new QueryClient();

  // Check if data exists in the cache
  const cachedData = queryClient.getQueryData<T>([uri, params]);
  const hasCachedData = !!cachedData;
  const {
    data,
    error,
    refetch,
    isLoading: loading,
  } = useTanQuery<T, ErrorType>({
    queryKey: queryKey || [url, params],
    enabled,
    staleTime,
    refetchInterval,
    refetchOnMount,
    refetchOnWindowFocus,
    refetchOnReconnect,
    gcTime: cacheTime,
    retry: 2,
    initialData: cachedData,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 300),
    queryFn: async () => {
      const response = await handleRequest(url, params);
      return response as T;
    },
  });

  const fetchData = async (reqUrl?: string) => {
    const newUrl = reqUrl || uri;
    setUrl(newUrl);
    setFetching(true);

    await queryClient.invalidateQueries({
      queryKey: queryKey || [newUrl, params],
    });
    const result = await refetch();
    setFetching(false);
    return result.data as T;
  };

  return {
    data: data as T,
    loading: loading || fetching,
    fetchData,
    error: error || null,
    hasCachedData,
  };
};
