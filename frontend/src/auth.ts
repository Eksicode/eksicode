import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

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
          let data;
          
          if (contentType && contentType.includes("application/json")) {
            data = await res.json();
          } else {
            // Handle non-JSON responses (e.g., rate limit plain text)
            const text = await res.text();
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

          return {
            id: data.user.id.toString(),
            username: data.user.username,
            email: data.user.email,
            firstName: data.user.firstName,
            lastName: data.user.lastName,
            roles: data.user.roles || ["user"],
            permissions: data.user.permissions || [],
            profilePicture: data.user.profilePicture,
            verified: data.user.verified || false,
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
