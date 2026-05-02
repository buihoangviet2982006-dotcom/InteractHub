import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import { authApi } from '../services/authApi';
import type { LoginDto, RegisterDto, User, DecodedToken } from '../types/auth';
import { formatImageData } from '../services/postsApi';

interface AuthContextValue {
  isAuthenticated: boolean;
  user: User | null;
  login: (data: LoginDto) => Promise<User>;
  register: (data: RegisterDto) => Promise<User>;
  setUser: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initAuth = () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (token && storedUser) {
        try {
          const decoded = jwtDecode<DecodedToken>(token);
          if (decoded.exp * 1000 < Date.now()) {
            throw new Error('Token expired');
          }
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Lỗi xác thực token:", error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setIsInitializing(false);
    };

    initAuth();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated,
      user,
      login: async (data: LoginDto) => {
        const res = await authApi.login(data);
        const decoded = jwtDecode<DecodedToken>(res.token);
        
        const loggedUser: User = {
          id: res.userId,
          email: res.email,
          fullName: res.fullName,
          avatarData: formatImageData(res.avatarData),
          role: decoded.role || decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || 'User',
        };

        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(loggedUser));
        setUser(loggedUser);
        setIsAuthenticated(true);
        return loggedUser;
      },
      register: async (data: RegisterDto) => {
        const res = await authApi.register(data);
        const decoded = jwtDecode<DecodedToken>(res.token);
        
        const loggedUser: User = {
          id: res.userId,
          email: res.email,
          fullName: res.fullName,
          avatarData: formatImageData(res.avatarData),
          role: decoded.role || decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || 'User',
        };

        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(loggedUser));
        setUser(loggedUser);
        setIsAuthenticated(true);
        return loggedUser;
      },
      setUser: (userData: User) => {
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
      },
      logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setIsAuthenticated(false);
      },
    }),
    [isAuthenticated, user],
  );

  if (isInitializing) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">Đang khởi tạo ứng dụng...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth phải được sử dụng bên trong AuthProvider');
  }
  return context;
}
