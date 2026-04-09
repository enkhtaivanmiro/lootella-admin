'use client';

import { atom } from 'jotai';
import Cookies from 'js-cookie';
import api from '@/lib/axios';
import { setTokensCookie } from '@/lib/utils/auth';

export type UserMeType = {
  id: string;
  account_id: string;
  profile_image: string;
  display_name: string;
  createdAt: string;
  updatedAt: string;
  trade_url?: string;
  role: string;
};

export const loadingAuthAtom = atom(true);
export const isAuthAtom = atom<boolean>(false);
export const openAuthModalAtom = atom<boolean>(false);
export const userMeAtom = atom<UserMeType | null>(null);

export const loginAtom = atom(
  null,
  async (get, set, { isRefresh, router }: { isRefresh: boolean; router: any }) => {
    const access = Cookies.get('access');
    const refresh = Cookies.get('refresh');

    if (!access && !refresh) {
      set(isAuthAtom, false);
      set(userMeAtom, null);
      set(loadingAuthAtom, false);
      return;
    }

    try {
      set(loadingAuthAtom, true);
      

      try {
        const userData: any = await api.get('/v1/users/me');
        set(isAuthAtom, true);
        set(userMeAtom, userData);
        set(loadingAuthAtom, false);
        if (!isRefresh && router) {
          router.replace('/');
        }
        return;
      } catch (e: any) {
        if (refresh) {
          const response: any = await api.post('/v1/auth/loginWithRefreshToken', { refreshToken: refresh });
          if (response.access_token) {
            setTokensCookie(response.access_token, response.refresh_token);
            const userData: any = await api.get('/v1/users/me');
            set(isAuthAtom, true);
            set(userMeAtom, userData);
            set(loadingAuthAtom, false);
            if (!isRefresh && router) {
              router.replace('/');
            }
            return;
          }
        }
        throw e;
      }
    } catch (error) {
      console.error('Authentication error:', error);
      set(isAuthAtom, false);
      set(userMeAtom, null);
      set(loadingAuthAtom, false);
      Cookies.remove('access');
      Cookies.remove('refresh');
      delete api.defaults.headers.Authorization;
    }
  }
);

export const logoutAtom = atom(null, (get, set) => {
  Cookies.remove('access');
  Cookies.remove('refresh');
  delete api.defaults.headers.Authorization;
  set(isAuthAtom, false);
  set(userMeAtom, null);
  set(loadingAuthAtom, false);
});
