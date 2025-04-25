import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedPaths = [
  '/dashboard',
  '/profile',
  '/trips',
  '/wishlist',
  '/settings',
  '/plan-trip',
];

const publicOnlyPaths = ['/login', '/signup', '/forgot-password'];

export function middleware(request: NextRequest) {
  const authCookie = request?.cookies?.get('auth-token')?.value || '';
  const isAuthenticated = !!authCookie;

  const { pathname } = request.nextUrl;

  // if (pathname === '/') {
  //   return !isAuthenticated
  //     ? NextResponse.redirect(new URL('/home', request.url))
  //     : NextResponse.redirect(new URL('/dashboard', request.url));
  // }

  // const isProtectedPath = protectedPaths.some((path) =>
  //   pathname.startsWith(path)
  // );

  // const isPublicOnlyPath = publicOnlyPaths.some((path) =>
  //   pathname.startsWith(path)
  // );

  // if (isProtectedPath && !isAuthenticated) {
  //   const url = new URL('/login', request.url);
  //   url.searchParams.set('redirect', pathname);
  //   return NextResponse.redirect(url);
  // }

  // if (isPublicOnlyPath && isAuthenticated) {
  //   return NextResponse.redirect(new URL('/dashboard', request.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
