'use client';

import { useAuth } from '@/hooks/useAuth';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';
import { UserRole } from '@/types/auth';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  fallbackRoute?: string;
  showLoading?: boolean;
}

export function RoleGuard({ 
  children, 
  allowedRoles, 
  fallbackRoute = '/dashboard', 
  showLoading = true 
}: RoleGuardProps) {
  const { user, isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      // Redirect if not authenticated
      if (!isAuthenticated) {
        redirect('/auth/uye-giris');
        return;
      }

      // Check if user has required role
      const hasRequiredRole = user?.roles?.some((role: string) => 
        allowedRoles.includes(role as UserRole)
      );

      if (!hasRequiredRole) {
        redirect(fallbackRoute);
        return;
      }
    }
  }, [user, isLoading, isAuthenticated, allowedRoles, fallbackRoute]);

  // Show loading while checking auth
  if (isLoading) {
    return showLoading ? (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    ) : null;
  }

  // Don't render if no user or wrong role
  if (!user || !user.roles?.some((role: string) => allowedRoles.includes(role as UserRole))) {
    return null;
  }

  return <>{children}</>;
}

// Specific guard components
export function UserGuard({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={['user']}>
      {children}
    </RoleGuard>
  );
}
