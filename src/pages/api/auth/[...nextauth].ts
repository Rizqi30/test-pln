import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import jwt from 'jsonwebtoken';

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      authorize(credentials) {
        const { username, password } = credentials || {};
        if (username === 'admin' && password === 'admin123') {
          const fakeToken = jwt.sign(
            { sub: '1', email: 'admin@example.com' }, // Payload
            process.env.NEXT_AUTH_SECRET || 'your-secret-key', // Secret Key
            { expiresIn: '1h' } // Token expire time
          );
          return {
            id: '1',
            name: 'Admin User',
            email: 'admin@example.com',
            access_token: fakeToken,
          };
        }
        return null;
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Tambahkan data user ke token
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }

      return token;
    },
    async session({ session, token }) {
      // Tambahkan token ke session
      session.user = token;
      return session;
    },
  },

  secret: process.env.NEXT_AUTH_SECRET, // Gunakan SECRET untuk keamanan JWT
});
