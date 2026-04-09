import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessCookie = request.cookies.get('access');


  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/auth');
  const isStaticFile = pathname.match(/\.(png|jpg|jpeg|webp|svg|gif|ico|txt|css|js|map|wav|mp3|m4a|aac|ogg|mp4)$/);
  const isNextInternal = pathname.startsWith('/_next') || pathname.startsWith('/api');

  if (isAuthPage || isStaticFile || isNextInternal) {
    if (isAuthPage && accessCookie && pathname === '/login') {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  if (!accessCookie) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
