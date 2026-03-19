import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

type Role = 'guest' | 'member' | 'instructor' | 'admin';

interface RequireRoleProps {
  roles: Role[];
  children: ReactNode;
}

export function RequireRole({ roles, children }: RequireRoleProps) {
  const { role } = useAuth();

  if (roles.includes(role)) {
    return <>{children}</>;
  }

  return <Navigate to="/not-authorized" replace />;
}
