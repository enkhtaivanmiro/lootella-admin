'use client';
import { useCallback, useEffect, useState } from 'react';

import axios from '@/lib/axios';
import { ErrorType } from '@/schema';

export interface UseAxiosQueryProps {
  uri: string;
  enabled?: boolean;
  params?: Record<string, any>;
}

export interface UseAxiosQueryValue<T> {
  data: T;
  error?: ErrorType;
  loading: boolean;
  setResponse: React.Dispatch<React.SetStateAction<T | null>>;
  fetchData: (path?: string, params?: Record<string, any>) => Promise<T>;
}

export const useQuery = <T>({
  uri,
  enabled,
  params = {},
}: UseAxiosQueryProps): UseAxiosQueryValue<T> => {
  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<T | null>(null);
  const [error, setError] = useState();

  useEffect(() => {
    if (!loading && enabled) fetchData(uri, params);
  }, [enabled]);

  const fetchData = useCallback(
    (path: string = uri, queryParams?: Record<string, any>) => {
      setLoading(true);
      const dto = Object.keys(queryParams || params).reduce(
        (acc: Record<string, any>, cur) => {
          if ((queryParams || params)[cur]) {
            acc[cur] = (queryParams || params)[cur];
          }
          return acc;
        },
        {},
      );
      return axios
        .get(path, {
          params: dto,
          paramsSerializer: {
            indexes: null, // 👈 important
          },
        })
        .then((res) => {
          setLoading(false);
          setResponse(res as T);
          return res;
        })
        .catch((e) => {
          setLoading(false);
          setError(e);
          return e;
        });
    },
    [],
  );

  return { data: response as T, loading, error, fetchData, setResponse };
};
