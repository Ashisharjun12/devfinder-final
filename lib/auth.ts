import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import clientPromise from '@/lib/mongodb-adapter';

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
      }
      return token;
    },
    async redirect({ url, baseUrl }) {
      // Get allowed URLs from environment variables
      const allowedUrls = [
        process.env.NEXTAUTH_URL,
        process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`,
        process.env.NEXT_PUBLIC_APP_URL
      ].filter(Boolean) as string[];
      
      // If relative URL, append to base
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }
      
      // Check if URL is allowed
      try {
        const urlHost = new URL(url).origin;
        if (allowedUrls.includes(urlHost)) {
          return url;
        }
      } catch {
        return baseUrl;
      }
      
      return baseUrl;
    }
  },
  pages: {
    signIn: '/auth/signin',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};
