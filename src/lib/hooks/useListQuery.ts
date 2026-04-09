'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import axios from '@/lib/axios';

type ErrorType = any;

export interface UseListQueryProps {
  uri: string;
  enabled?: boolean;
  mode?: 'simple' | 'infinite';
  params?: Record<string, any>;
}

export interface PaginatedListType<T> {
  data: T[];
  limit: number;
  page: number;
  total: number;
  totalPages: number;
}

export interface UseListQueryValue<T> {
  data: T[];
  loading: boolean;
  error?: ErrorType;
  setData: React.Dispatch<React.SetStateAction<T[]>>;

  current: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;

  fetchData: (params?: Record<string, any>) => Promise<PaginatedListType<T>>;
  fetchMore: (
    params?: Record<string, any>,
  ) => Promise<PaginatedListType<T> | void>;
}

export const useListQuery = <T>({
  uri,
  enabled = true,
  params = { page: 1, limit: 12 },
}: UseListQueryProps): UseListQueryValue<T> => {
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<T[]>([]);
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState<ErrorType>();

  const hasNextPage = current < totalPages;

  useEffect(() => {
    if (enabled) {
      fetchData(params);
    }
  }, [searchParams, enabled]);

  const makeRequest = async (queryParams?: Record<string, any>) => {
    try {
      setLoading(true);
      const res = await axios.get(uri, {
        params: queryParams ?? params,
      });
      return res as any as PaginatedListType<T>;
    } catch (e) {
      setError(e as ErrorType);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const fetchData = useCallback(async (queryParams?: Record<string, any>) => {
    const res = await makeRequest(queryParams);

    setData(res.data);
    setCurrent(res.page);
    setTotal(res.total);
    setTotalPages(res.totalPages);

    return res;
  }, []);

  const fetchMore = useCallback(
    async (queryParams?: Record<string, any>) => {
      if (!hasNextPage) return;

      const nextParams = {
        ...params,
        page: current + 1,
        ...(queryParams || {}),
      };

      const res = await makeRequest(nextParams);

      setData((prev) => [...prev, ...res.data]);
      setCurrent(res.page);
      setTotal(res.total);
      setTotalPages(res.totalPages);

      return res;
    },
    [current, hasNextPage],
  );

  return {
    data,
    error,
    total,
    setData,
    totalPages,
    loading,
    fetchData,
    fetchMore,
    hasNextPage,
    current,
  };
};
