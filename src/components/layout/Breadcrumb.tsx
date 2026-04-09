"use client";

import React from "react";
import Link from "next/link";
import { LogIn, LogOut, User as UserIcon, ChevronDown } from "lucide-react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { isAuthAtom, userMeAtom, openAuthModalAtom, logoutAtom } from "@/atoms/auth";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  const isAuth = useAtomValue(isAuthAtom);
  const user = useAtomValue(userMeAtom);
  const setOpenAuthModal = useSetAtom(openAuthModalAtom);
  const logout = useSetAtom(logoutAtom);

  return (
    <div className="fixed top-0 right-0 left-[268px] z-[200]">
      <div className="flex h-[70px] items-center justify-between border-b border-[#242424] bg-[#141414] px-8 py-[14px]">
        <nav className="flex items-center gap-1.5 font-semibold text-sm">
          {items.map((item, index) => (
            <React.Fragment key={item.label}>
              {item.href ? (
                <Link 
                  href={item.href}
                  className="text-[#EAEAEA] opacity-50 transition-opacity hover:opacity-100"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-[#EAEAEA]">
                  {item.label}
                </span>
              )}
              {index < items.length - 1 && (
                <span className="text-[#EAEAEA] opacity-50 px-1">/</span>
              )}
            </React.Fragment>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {isAuth ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 py-1 px-3 rounded-[12px] bg-[#1a1a1a] border border-[#242424] hover:border-[#3E3E3E] transition-all cursor-pointer group">
                <div className="h-8 w-8 rounded-full bg-[#242424] flex items-center justify-center text-[#8c8c8c] border border-[#3E3E3E]">
                  {user?.profile_image ? (
                    <img src={user.profile_image} alt={user.display_name} className="h-full w-full rounded-full" />
                  ) : (
                    <UserIcon className="h-4 w-4" />
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#EAEAEA] leading-none">{user?.display_name}</span>
                  <span className="text-[10px] text-[#8c8c8c] font-medium mt-1 uppercase tracking-wider">{user?.role || 'Admin'}</span>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-[#8c8c8c] group-hover:text-[#EAEAEA] transition-colors ml-1" />
              </div>
              
              <button 
                onClick={() => logout()}
                className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#1a1a1a] border border-[#242424] text-[#8c8c8c] hover:text-[#E4626F] hover:border-[#E4626F]/20 hover:bg-[#E4626F]/5 transition-all"
                title="Log Out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setOpenAuthModal(true)}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#EAEAEA] rounded-[12px] text-sm font-bold text-[#141414] hover:bg-white transition-all shadow-lg shadow-white/5 active:scale-[0.98]"
            >
              <LogIn className="h-4 w-4" />
              Log In
            </button>
          )}
        </div>
      </div>
      <div className="h-[70px] w-full invisible" />
    </div>
  );
}
