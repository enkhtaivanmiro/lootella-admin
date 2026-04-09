import Cookies from 'js-cookie';

export function base64Extract(base64: string) {
  if (typeof window !== 'undefined') {
    return decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  }
  return Buffer.from(base64, 'base64').toString('utf8');
}

export function parseJwt(token: string): any {
  if (!token) return;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(base64Extract(base64));
  } catch (e) {
    return null;
  }
}

export function setTokensCookie(
  accessToken: string,
  refreshToken?: string,
): void {
  const accessPayload = parseJwt(accessToken);
  const refreshPayload = refreshToken ? parseJwt(refreshToken) : null;
  
  if (accessPayload?.exp) {
    Cookies.set('access', accessToken, {
      expires: new Date(accessPayload.exp * 1000),
    });
  }
  
  if (refreshToken && refreshPayload?.exp) {
    Cookies.set('refresh', refreshToken, {
      expires: new Date(refreshPayload.exp * 1000),
    });
  }
}
