import { withAuth } from 'next-auth/middleware';

export default withAuth({
  pages: {
    signIn: '/login',
  },
});

export const config = {
  matcher: [
    '/',
    '/api/files/:path*',
    '/((?!login|register|api/auth).*)',
  ],
}; 