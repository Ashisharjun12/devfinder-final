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
  ];

  // Check if the current path is protected
  const isProtectedPath = protectedPaths.some(protectedPath => {
    if (protectedPath.includes(':path*')) {
      const baseRoute = protectedPath.split('/:path*')[0];
      return path.startsWith(baseRoute);
    }
    return path === protectedPath || path.startsWith(protectedPath);
  });

  // If path is protected and user is not authenticated
  if (isProtectedPath && !isAuthenticated) {
    const signInUrl = new URL('/auth/signin', request.url);
    signInUrl.searchParams.set('callbackUrl', request.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

// Update matcher to include exact paths
export const config = {
  matcher: [
   
    '/projects/new',
    '/projects/edit/:path*',
    '/projects/:path*/messages',
    '/projects/:path*/apply',
    '/projects/:path*/settings',
  ]
};
