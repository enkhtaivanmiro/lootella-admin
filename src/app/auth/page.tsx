'use client';

import React, { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSetAtom } from 'jotai';
import { loginAtom } from '@/atoms/auth';
import { setTokensCookie } from '@/lib/utils/auth';

function AuthHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = useSetAtom(loginAtom);

  const accessToken = searchParams.get('access_token');
  const refreshToken = searchParams.get('refresh_token');

  useEffect(() => {
    if (accessToken) {
      setTokensCookie(accessToken, refreshToken || undefined);
      
      login({ isRefresh: false, router });
      
    } else {
      router.replace('/');
    }
  }, [accessToken, refreshToken, login, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#141414]">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#2D73FF] border-t-transparent"></div>
        <p className="text-sm font-semibold text-[#8c8c8c]">Finalizing authentication...</p>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-[#141414]">
        <p className="text-sm font-semibold text-[#8c8c8c]">Loading...</p>
      </div>
    }>
      <AuthHandler />
    </Suspense>
  );
}
