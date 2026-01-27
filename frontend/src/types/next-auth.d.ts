import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    token: string;
    id?: string;
    name?: string;
    email?: string;
    username?: string;
    profilePicture?: string;
    roles?: string[];
    permissions?: string[];
    firstName?: string;
    lastName?: string;
    verified?: boolean;
  }

  interface Session {
    accessToken: string;
    user: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string;
    id?: string;
    name?: string;
    email?: string;
    roles?: string[];
    permissions?: string[];
    userId?: string;
  }
}
