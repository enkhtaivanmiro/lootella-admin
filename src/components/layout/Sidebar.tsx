'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Box,
  Users,
  CreditCard,
  LogOut,
  TrendingUp,
  ShieldCheck,
  LifeBuoy,
} from 'lucide-react';
import { useSetAtom } from 'jotai';
import { logoutAtom } from '@/atoms/auth';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
  { icon: Box, label: 'Cases', href: '/cases' },
  { icon: Users, label: 'Users', href: '/users' },
  { icon: CreditCard, label: 'Transactions', href: '/transactions' },
  { icon: TrendingUp, label: 'Analytics', href: '/analytics' },
  { icon: ShieldCheck, label: 'Security', href: '/security' },
];

export function Sidebar() {
  const pathname = usePathname();
  const logout = useSetAtom(logoutAtom);

  return (
    <aside className="flex h-screen w-[268px] flex-col border-r border-[#242424] bg-[#1a1a1a] sticky top-0">
      <div className="flex h-[70px] items-center gap-3 border-b border-[#242424] px-5 py-[17px]">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#242424]">
          <Box className="h-5 w-5 text-[#EAEAEA]" />
        </div>
        <div>
          <p className="text-[12px] font-semibold leading-none text-[#8c8c8c]">
            Lootella Admin
          </p>
          <p className="mt-1 text-[16px] font-bold leading-none text-[#EAEAEA]">
            Dashboard
          </p>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <nav className="flex flex-col gap-1 p-4">
          {menuItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href} className="group">
                <div
                  className={cn(
                    'flex items-center gap-[10px] rounded-[12px] px-3 py-[10px] text-sm font-semibold transition-all duration-200 ease-in-out border border-transparent',
                    isActive ||
                      'group-hover:opacity-100 group-hover:bg-[#292929] group-hover:border-[#3E3E3E]',
                    isActive
                      ? 'opacity-100 bg-[#292929] border-[#3E3E3E] text-[#EAEAEA]'
                      : 'opacity-50 text-[#EAEAEA]',
                  )}
                >
                  <item.icon className="h-5 w-5 shrink-0" strokeWidth={2.5} />
                  <span>{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      <div className="flex flex-col gap-1 border-t border-[#242424] p-4">
        <Link href="/help" className="group">
          <div className="flex items-center gap-[10px] rounded-[12px] px-3 py-[10px] text-sm font-semibold opacity-50 text-[#EAEAEA] transition-all hover:opacity-100 hover:bg-[#292929] hover:border-[#3E3E3E] border border-transparent">
            <LifeBuoy className="h-5 w-5 shrink-0" strokeWidth={2.5} />
            <span>Support</span>
          </div>
        </Link>
        {/* <button onClick={() => logout()} className="group w-full text-left">
          <div className="flex items-center gap-[10px] rounded-[12px] px-3 py-[10px] text-sm font-semibold text-[#E4626F] opacity-50 transition-all hover:opacity-100 hover:bg-[#292929] hover:border-[#332121] border border-transparent">
            <LogOut className="h-5 w-5 shrink-0" strokeWidth={2.5} />
            <span>Logout</span>
          </div>
        </button> */}
      </div>
    </aside>
  );
}
