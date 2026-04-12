import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

type Role = 'guest' | 'member' | 'instructor' | 'admin';

interface RequireRoleProps {
  roles: Role[];
  children: ReactNode;
}

export function RequireRole({ roles, children }: RequireRoleProps) {
  const { role, loading, isAuthenticated } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }


  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!roles.includes(role)) {
    return <Navigate to="/not-authorized" replace />;
  }

  return <>{children}</>;
}