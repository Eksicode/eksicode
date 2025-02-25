import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface User {
    token: string;
    roles?: string[];
    id?: string;
  }
  interface JWT {
    roles?: string[];
    accessToken: string;
    userId?: string;
  }
}

const handler = NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 1 day by default
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        userInfo: { label: "Email/Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.userInfo || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                userInfo: credentials.userInfo,
                password: credentials.password,
              }),
            }
          );

          const user = await res.json();

          if (!res.ok) {
            throw new Error(user.message || "Authentication failed");
          }

          return user;
        } catch (error) {
          throw new Error("Authentication failed");
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/uye-giris",
    signOut: "/auth/uye-cikis",
    error: "/auth/error", // Error code passed in query string as ?error=
    verifyRequest: "/auth/verify-request", // (used for check email message)
    newUser: "/auth/uye-ol", // New users will be directed here on first sign in (leave the property out if not of interest)
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.token;
        token.roles = user.roles;
        token.userId = user.id;
      }
      return token;
    },
    async session({ session, token }: { session: any, token: JWT }) {
      if (!token.accessToken) {
        return { expires: session.expires };
      }

      try {
        // Add caching mechanism to reduce frequent backend calls
        const now = Date.now();
        const lastCheck = (token as any).lastVerified || 0;
        const checkInterval = 5 * 60 * 1000; // 5 minutes

        if (now - lastCheck < checkInterval) {
          // Use cached session data
          session.user = {
            ...session.user,
            roles: token.roles,
            id: token.userId,
          };
          session.accessToken = token.accessToken;
          return session;
        }

        // Verify token and user roles against the backend
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token.accessToken}`,
          },
        });

        if (!response.ok) {
          // If verification fails, clear the session
          return { expires: session.expires };
        }

        const verifiedData = await response.json();
        (token as any).lastVerified = now;

        // Update session with verified data
        session.user = {
          ...session.user,
          roles: verifiedData.roles,
          id: verifiedData.userId,
        };
        session.accessToken = token.accessToken;
        return session;
      } catch (error) {
        console.error('Session verification error:', error);
        // Return expired session on error
        return { expires: session.expires };
      }
    },
  },
});

export { handler as GET, handler as POST };
