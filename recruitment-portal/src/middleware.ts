import { NextResponse, type NextRequest } from 'next/server';

// Paths that require a session. Because /api is proxied through this same
// origin, the auth cookies are first-party and readable here at the edge.
const PROTECTED_PREFIXES = ['/applications', '/candidates', '/dashboard', '/profile'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
  if (!isProtected) return NextResponse.next();

  const hasSession =
    req.cookies.has('access_token') || req.cookies.has('refresh_token');

  if (!hasSession) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/applications/:path*',
    '/candidates/:path*',
    '/dashboard/:path*',
    '/profile/:path*',
  ],
};
