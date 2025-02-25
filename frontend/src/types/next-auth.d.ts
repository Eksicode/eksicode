import NextAuth from "next-auth"

declare module "next-auth" {
  interface User {
    token: string;
    id?: string;
    name?: string;
    email?: string;
    username?: string;
    profilePicture?: string;
    roles?: string[];
  }

  interface Session {
    accessToken: string;
    user: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string;
    roles?: string[];
    userId?: string;
  }
}
