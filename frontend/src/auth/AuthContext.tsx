import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import api from '../api/api';

type Role = 'guest' | 'member' | 'instructor' | 'admin';

export interface UserInfo {
  id: number;
  email: string;
  role: Role;
}

interface AuthContextValue {
  role: Role;
  setRole: (role: Role) => void;
  user: UserInfo | null;
  isAuthenticated: boolean;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>('guest');
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get('/auth/me');
        const fetchedUser = res.data;
        const normalizedRole = fetchedUser.role.toLowerCase() as Role;
        setRole(normalizedRole);
        setUser({
          id: fetchedUser.id,
          email: fetchedUser.email,
          role: normalizedRole,
        });
      } catch {
        localStorage.removeItem('token');
        setRole('guest');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);


  const logout = () => {
    localStorage.removeItem('token');
    setRole('guest');
    setUser(null);
  };

  return (
      <AuthContext.Provider
          value={{
            role,
            setRole,
            user,
            isAuthenticated: role !== 'guest',
            logout,
            loading,
          }}
      >
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