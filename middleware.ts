import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth');

  if (isAuthPage) {
    if (token) {
      // If user is already logged in and tries to access auth pages,
      // redirect to home page
      return NextResponse.redirect(new URL('/', request.url));
    }
    // Allow access to auth pages for non-logged in users
    return NextResponse.next();
  }

  // Protect these routes
  const protectedPaths = ['/projects', '/profile', '/messages'];
  const isProtectedPath = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtectedPath) {
    if (!token) {
      // Redirect to login if trying to access protected route without being logged in
      const redirectUrl = new URL('/auth/signin', request.url);
      redirectUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/projects/:path*',
    '/profile/:path*',
    '/messages/:path*',
    '/auth/:path*'
  ]
};
