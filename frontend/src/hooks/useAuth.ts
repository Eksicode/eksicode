"use client";
import { useSession } from "next-auth/react";
import { useMemo } from "react";

export function useAuth() {
  const { data: session, status } = useSession();

  const authData = useMemo(() => {
    const isLoading = status === "loading";
    const isAuthenticated = !!session?.accessToken;
    const user = session?.user ? {
      id: session.user.id,
      username: session.user.name || "",
      email: session.user.email || "",
    } : null;
    const token = session?.accessToken;

    return {
      isLoading,
      isAuthenticated,
      user,
      token,
      session,
    };
  }, [session, status]);

  return authData;
}
