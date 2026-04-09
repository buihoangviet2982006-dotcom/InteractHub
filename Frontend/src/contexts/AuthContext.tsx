import { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

interface AuthContextValue {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(localStorage.getItem('token')));

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated,
      login: async (username: string, password: string) => {
        if (!username.trim() || !password.trim()) {
          throw new Error('Tên đăng nhập và mật khẩu là bắt buộc');
        }
        localStorage.setItem('token', `demo-token-${Date.now()}`);
        setIsAuthenticated(true);
      },
      logout: () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      },
    }),
    [isAuthenticated],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth phải được sử dụng bên trong AuthProvider');
  }
  return context;
}
