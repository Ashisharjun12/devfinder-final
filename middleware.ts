import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const isAuthenticated = !!token;
  const path = request.nextUrl.pathname;

  // Define protected routes
  const protectedPaths = [
    '/projects/new',
    '/projects/edit/:path*',
    '/projects/:path*/messages',
    '/projects/:path*/apply',
    '/projects/:path*/settings',
    '/messages/:path*',
    '/profile/:path*',
  ];

  // Check if the current path is protected
  const isProtectedPath = protectedPaths.some(protectedPath => {
    if (protectedPath.includes(':path*')) {
      const baseRoute = protectedPath.split('/:path*')[0];
      return path.startsWith(baseRoute);
    }
    return path === protectedPath;
  });

  if (isProtectedPath && !isAuthenticated) {
    const signInUrl = new URL('/auth/signin', request.url);
    signInUrl.searchParams.set('callbackUrl', request.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/projects/new',
    '/projects/edit/:path*',
    '/projects/:path*/messages',
    '/projects/:path*/apply',
    '/projects/:path*/settings',
    '/messages/:path*',
    '/profile/:path*',
  ]
};
