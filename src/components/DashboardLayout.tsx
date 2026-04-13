'use client';

import React from 'react';
import { Sidebar } from './layout/Sidebar';
import { AuthModal } from '@/app/auth/_components/AuthModal';
import { useSetAtom } from 'jotai';
import { loginAtom } from '@/atoms/auth';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const login = useSetAtom(loginAtom);

  React.useEffect(() => {
    login({ isRefresh: true, router: null });
  }, [login]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden relative">
        <main className="flex-1 overflow-y-auto">
          <div className="w-full">{children}</div>
        </main>
        <AuthModal />
      </div>
    </div>
  );
}
