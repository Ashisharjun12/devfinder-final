import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image: string;
      skills: string[];
      languages: string[];
    };
  }

  interface User {
    id: string;
    name: string;
    email: string;
    image: string;
    githubId: string;
    skills: string[];
    languages: string[];
  }
}
