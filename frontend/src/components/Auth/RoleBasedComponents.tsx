'use client';

import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { ReactNode } from 'react';

interface RoleBasedLinkProps {
  href?: string;
  adminHref?: string;
  userHref?: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

/**
 * Link component that shows different URLs based on user role
 */
export function RoleBasedLink({ 
  href, 
  adminHref, 
  userHref, 
  children, 
  className,
  onClick 
}: RoleBasedLinkProps) {
  const { isAdmin } = useAuth();

  // Determine the URL based on role
  let targetHref = href;
  if (!targetHref) {
    targetHref = isAdmin ? (adminHref || '/admin') : (userHref || '/profile');
  }

  return (
    <Link href={targetHref} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}

interface ConditionalRenderProps {
  children: ReactNode;
  roles: string[];
  fallback?: ReactNode;
}

/**
 * Component that conditionally renders content based on user roles
 */
export function ConditionalRender({ children, roles, fallback }: ConditionalRenderProps) {
  const { user } = useAuth();

  const hasRequiredRole = user?.roles?.some(role => roles.includes(role));

  if (!hasRequiredRole) {
    return fallback ? <>{fallback}</> : null;
  }

  return <>{children}</>;
}

// Specific role-based components
export function AdminOnly({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <ConditionalRender roles={['admin', 'superadmin']} fallback={fallback}>
      {children}
    </ConditionalRender>
  );
}

export function SuperAdminOnly({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <ConditionalRender roles={['superadmin']} fallback={fallback}>
      {children}
    </ConditionalRender>
  );
}
