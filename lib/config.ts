export const config = {
  auth: {
    providers: ['google'],
    callbackUrl: '/dashboard',
  },
  api: {
    baseUrl: process.env.NEXTAUTH_URL,
  },
  db: {
    uri: process.env.MONGODB_URI,
  },
  routes: {
    protected: ['/projects', '/profile', '/messages'],
    public: ['/', '/auth/signin'],
  }
} as const;
