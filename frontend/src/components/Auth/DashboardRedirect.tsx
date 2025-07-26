'use client';

import { useAuth } from '@/hooks/useAuth';
import { getDashboardRedirect } from '@/utils/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Component that redirects users to appropriate dashboard based on their role
 * Use this in the main dashboard route or after login
 */
export function DashboardRedirect() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      const redirectPath = getDashboardRedirect(user.roles);
      router.replace(redirectPath);
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-600">Yönlendiriliyor...</p>
    </div>
  );
}
