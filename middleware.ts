import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { JWT } from 'next-auth/jwt';
import md5 from 'md5';

interface CustomJWT extends JWT {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }
}

export async function middleware(request: NextRequest) {
  const session = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET }) as CustomJWT;

  if (session?.user) {
    // Ensure we always have an image URL from Google
    const image = session.user.image || 
      (session.user.email ? `https://www.gravatar.com/avatar/${md5(session.user.email)}?d=mp` : null);

    // Create the user object with consistent image handling
    const user = {
      ...session.user,
      image: image,
    };

    // Update the request headers with the modified user info
    request.headers.set('x-user-info', JSON.stringify(user));
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
