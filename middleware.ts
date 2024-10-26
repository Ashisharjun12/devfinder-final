import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import md5 from 'md5';

// Simplified JWT interface - only include what we need
interface UserJWT {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }
}

export async function middleware(request: NextRequest) {
  const session = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  }) as UserJWT;

  if (session?.user) {
    const image = session.user.image || 
      (session.user.email && `https://www.gravatar.com/avatar/${md5(session.user.email)}?d=mp`);

    // Only update headers if we have user info
    if (image) {
      request.headers.set('x-user-info', JSON.stringify({
        ...session.user,
        image
      }));
    }
  }

  return NextResponse.next();
}

// Optimize matcher paths to be more specific
export const config = {
  matcher: [
    '/projects/:path*',
    '/profile/:path*',
    '/messages/:path*',
    '/auth/callback/:path*'  // Only match auth callback paths
  ]
};
