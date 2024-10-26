import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';
import md5 from 'md5';

export async function getUserFromToken(req: NextRequest) {
  const token = await getToken({ 
    req, 
    secret: process.env.NEXTAUTH_SECRET 
  });

  if (!token?.user) return null;

  return {
    ...token.user,
    image: token.user.image || getGravatarUrl(token.user.email)
  };
}

export function getGravatarUrl(email: string | null | undefined): string | null {
  if (!email) return null;
  return `https://www.gravatar.com/avatar/${md5(email)}?d=mp`;
}
