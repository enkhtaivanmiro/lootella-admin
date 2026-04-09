'use client';
import { useState } from 'react';
import { AxiosResponse } from 'axios';

import axios from '@/lib/axios';
import { ErrorType } from '@/schema';
import { toast } from 'sonner';

export interface UseMutationProps {
  uri: string;
  method?: 'post' | 'put' | 'delete' | 'patch' | 'get';
}

export interface UseMutationValue {
  error?: ErrorType;
  loading: boolean;
  request: (
    data: any,
    requestUri?: string,
  ) => Promise<AxiosResponse<string, any>>;
}

export const useMutation = ({
  uri,
  method = 'post',
}: UseMutationProps): UseMutationValue => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState();
  const request = (
    data: any,
    requestUri?: string,
  ): Promise<AxiosResponse<any, any>> => {
    setLoading(true);
    return axios
      .request({
        url: requestUri || uri,
        data,
        method,
      })
      .then((res: any) => {
        setLoading(false);

        return res;
      })
      .catch((e) => {
        setError(e);
        setLoading(false);
        toast.warning(e.message || 'Something went wrong.');
        return Promise.reject(e);
      });
  };

  return { loading, error, request };
};
