import axios, { InternalAxiosRequestConfig, AxiosResponse } from 'axios';

const baseURL =
  process.env.NEXT_PUBLIC_API_URL || 'https://api.lootella.example.com/admin';
const isServer = typeof window === 'undefined';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  // Same merchant header as lootellayes
  config.headers['merchant'] = 'portal';

  // Auth handles Steam cookies same as lootella
  if (isServer) {
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    const token = cookieStore.get('access')?.value;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  } else {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)access\s*=\s*([^;]*).*$)|^.*$/,
      '$1',
    );

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return config;
});

api.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error: any) => Promise.reject(error?.response?.data ?? error),
);

export default api;
