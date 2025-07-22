import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface User {
    token: string;
  }
  interface Session {
    accessToken: string;
  }
  interface JWT {
    accessToken: string;
  }
}

const handler = NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days to match backend
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        userInfo: { label: "Email/Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.userInfo || !credentials?.password) {
          return null;
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

          const data = await res.json();

          if (!res.ok || !data.success) {
            return null;
          }

          return {
            id: data.user.id.toString(),
            username: data.user.username,
            email: data.user.email,
            token: data.token,
          };
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/uye-giris",
    signOut: "/auth/uye-cikis",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.token;
        token.id = user.id;
        token.name = user.username;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.accessToken) {
        session.accessToken = token.accessToken;
        if (session.user) {
          session.user.id = token.id as string;
          session.user.name = token.name as string;
          session.user.email = token.email as string;
        }
      }
      return session;
    },
  },
  events: {
    async signOut({ token }) {
      // Call backend logout to blacklist token
      if (token?.accessToken) {
        try {
          await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token.accessToken}`,
            },
          });
        } catch (error) {
          console.error("Logout error:", error);
        }
      }
    },
  },
});

export { handler as GET, handler as POST };
