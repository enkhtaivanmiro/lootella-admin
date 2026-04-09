'use client';
import React, { useRef } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs from 'dayjs';

function QueryProvider({ children }: { children: React.ReactNode }) {
  dayjs.extend(relativeTime);

  const { current } = useRef(
    new QueryClient({
      defaultOptions: {
        queries: {
          retry: 1,
          refetchOnWindowFocus: false,
        },
      },
    }),
  );

  return <QueryClientProvider client={current}>{children}</QueryClientProvider>;
}

export default QueryProvider;
