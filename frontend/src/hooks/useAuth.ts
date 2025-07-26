"use client";
import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { User, AuthContextType } from "@/types/auth";

export function useAuth(): AuthContextType {
  const { data: session, status } = useSession();

  const authData = useMemo(() => {
    const isLoading = status === "loading";
    const isAuthenticated = !!session?.accessToken;
    
    const user: User | null = session?.user ? {
      id: session.user.id || "",
      username: session.user.username || session.user.name || "",
      email: session.user.email || "",
      firstName: session.user.firstName,
      lastName: session.user.lastName,
      roles: session.user.roles || ["user"],
      permissions: session.user.permissions || [],
      profilePicture: session.user.profilePicture,
      verified: session.user.verified || false,
    } : null;

    const token = session?.accessToken || null;

    const hasRole = (role: string): boolean => {
      return user?.roles?.includes(role) || false;
    };

    const hasPermission = (permission: string): boolean => {
      return user?.permissions?.includes(permission) || false;
    };

    const isAdmin = hasRole('admin') || hasRole('superadmin');
    const isSuperAdmin = hasRole('superadmin');

    return {
      isLoading,
      isAuthenticated,
      user,
      token,
      hasRole,
      hasPermission,
      isAdmin,
      isSuperAdmin,
    };
  }, [session, status]);

  return authData;
}
