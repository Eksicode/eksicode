'use client';

import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { ReactNode } from 'react';

interface RoleBasedLinkProps {
  href?: string;
  userHref?: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

/**
 * Link component for user profile routes
 */
export function RoleBasedLink({ 
  href, 
  userHref, 
  children, 
  className,
  onClick 
}: RoleBasedLinkProps) {
  // Use provided href, fallback to userHref, or default to /profile
  const targetHref = href || userHref || '/profile';

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

// User-specific component
export function UserOnly({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <ConditionalRender roles={['user']} fallback={fallback}>
      {children}
    </ConditionalRender>
  );
}
