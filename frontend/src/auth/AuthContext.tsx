import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import api from '../api/api';

type Role = 'guest' | 'member' | 'instructor' | 'admin';

interface AuthContextValue {
  role: Role;
  setRole: (role: Role) => void;
  isAuthenticated: boolean;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>('guest');
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
        const user = res.data;
        setRole(user.role.toLowerCase());
      } catch {
        localStorage.removeItem('token');
        setRole('guest');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);


  const logout = () => {
    localStorage.removeItem('token');
    setRole('guest');
  };

  return (
      <AuthContext.Provider
          value={{
            role,
            setRole,
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