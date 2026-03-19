import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

type Role = 'guest' | 'member' | 'instructor' | 'admin';

interface AuthContextValue {
  role: Role;
  setRole: (role: Role) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>('guest');

  return (
    <AuthContext.Provider value={{ role, setRole, isAuthenticated: role !== 'guest' }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
