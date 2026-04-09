'use client';
import Cookies from 'js-cookie';
import { usePathname } from 'next/navigation';
import { useSetAtom } from 'jotai';
import { openAuthModalAtom } from '@/atoms/auth';

export const useAuthActions = () => {
  const pathname = usePathname();
  const setOpenAuthModal = useSetAtom(openAuthModalAtom);

  const toLogin = (path?: string) => {
    Cookies.set('redirect', path || pathname);
    setOpenAuthModal(true);
  };

  return { toLogin };
};
