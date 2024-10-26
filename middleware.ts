import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const isAuthenticated = !!token;

  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Define protected routes
  const protectedPaths = [
    '/projects/[id]',      // Single project view
    '/projects/edit/[id]', // Edit project
    '/projects/new',       // Create new project
    '/profile',            // User profile
  ];

  // Check if the current path is protected
  const isProtectedPath = protectedPaths.some(protectedPath => {
    if (protectedPath.includes('[')) {
      // Handle dynamic routes
      const routePattern = new RegExp(
        `^${protectedPath.replace(/\[.*?\]/, '[^/]+')}$`
      );
      return routePattern.test(path);
    }
    return path === protectedPath;
  });

  if (isProtectedPath && !isAuthenticated) {
    // Redirect to signin page if trying to access protected route while not authenticated
    const signInUrl = new URL('/auth/signin', request.url);
    signInUrl.searchParams.set('callbackUrl', path);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    '/projects/:path*',
    '/profile/:path*',
    // Add other protected routes here
  ]
};
