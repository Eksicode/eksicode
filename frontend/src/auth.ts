import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

interface LoginApiUser {
  id: number | string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  roles?: string[];
  permissions?: string[];
  profilePicture?: string | null;
  verified?: boolean;
}

interface LoginApiResponse {
  success?: boolean;
  message?: string;
  user?: LoginApiUser;
  token?: string;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  trustHost: true,
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days to match backend
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        userInfo: { label: "Email/Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.userInfo || !credentials?.password) {
          throw new Error("Email/username and password are required");
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

          // Check if response is JSON before parsing
          const contentType = res.headers.get("content-type");
          let data: LoginApiResponse;

          if (contentType && contentType.includes("application/json")) {
            data = (await res.json()) as LoginApiResponse;
          } else {
            // Handle non-JSON responses (e.g. 401 from gateway, rate limit plain text)
            const text = await res.text();
            if (res.status === 401) {
              throw new Error("INVALID_CREDENTIALS");
            }
            throw new Error(text || "Authentication failed");
          }

          if (!data.success || !res.ok) {
            const errorMessage = data.message || "Authentication failed";

            if (errorMessage.toLowerCase().includes("verify") ||
                errorMessage.toLowerCase().includes("verification") ||
                errorMessage.toLowerCase().includes("email")) {
              throw new Error("EMAIL_VERIFICATION_REQUIRED");
            }

            if (errorMessage.toLowerCase().includes("invalid credentials") ||
                errorMessage.toLowerCase().includes("user not found")) {
              throw new Error("INVALID_CREDENTIALS");
            }

            throw new Error(errorMessage);
          }

          const user = data.user;
          if (!user) {
            throw new Error("Authentication failed: no user data");
          }
          if (!data.token) {
            throw new Error("Authentication failed: no token");
          }

          return {
            id: user.id.toString(),
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            roles: user.roles ?? ["user"],
            permissions: user.permissions ?? [],
            profilePicture: user.profilePicture ?? undefined,
            verified: user.verified ?? false,
            token: data.token,
          };
        } catch (error) {
          console.error("Authentication error:", error);
          
          // Re-throw the error to be handled by NextAuth
          if (error instanceof Error) {
            throw error;
          }
          
          throw new Error("An unexpected error occurred during authentication");
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
    async jwt({ token, user, trigger }) {
      if (user) {
        token.accessToken = user.token;
        token.id = user.id;
        token.name = user.username;
        token.email = user.email;
        token.roles = user.roles;
        token.permissions = user.permissions;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.accessToken) {
        session.accessToken = token.accessToken as string;
        if (session.user) {
          session.user.id = token.id as string;
          session.user.name = token.name as string;
          session.user.username = token.name as string;
          session.user.email = token.email as string;
          session.user.roles = token.roles as string[];
          session.user.permissions = token.permissions as string[];
        }
      }
      return session;
    },
  },
  events: {
    async signOut(message) {
      // Call backend logout to blacklist token
      // Handle both session and token strategies (NextAuth v5 union type)
      const token = "token" in message ? message.token : null;
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
