import NextAuth, { User, type DefaultSession } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { NextResponse } from 'next/server';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
    } & DefaultSession['user']
  }
}

export const {
  handlers: { GET, POST },
  auth,
  CSRF_experimental,
} = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize({ email, password }) {
        if (
          process.env.ADMIN_EMAIL && process.env.ADMIN_EMAIL === email &&
          process.env.ADMIN_PASSWORD && process.env.ADMIN_PASSWORD === password
        ) {
          const user: User = { id: '1', email, name: 'Admin User' };
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    authorized({ auth, request }) {
      const url = new URL(request.url);
      const { pathname } = url;

      const isUrlProtected = pathname.startsWith('/admin');
      const isLoggedIn = !!auth?.user;
      const isAuthorized = !isUrlProtected || isLoggedIn;

      if (pathname === '/admin') {
        url.pathname = '/admin/photos';
        return NextResponse.redirect(url);
      }

      return isAuthorized;
    },
  },
  pages: {
    signIn: '/sign-in',
  },
});