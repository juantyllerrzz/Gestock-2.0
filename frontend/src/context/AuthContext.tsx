import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { api } from '../lib/api';

export type Role = 'ADMIN' | 'MANAGER' | 'EMPLOYEE';
export interface AuthUser { id: string; name: string; email: string; role: Role; }

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  register: (name: string, email: string, password: string) => Promise<{ message: string; verificationCode: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('gestock_token');
    if (!token) { setLoading(false); return; }
    api.get<AuthUser>('/auth/me')
      .then((res) => setUser(res.data))
      .catch(() => localStorage.removeItem('gestock_token'))
      .finally(() => setLoading(false));
  }, []);

  async function login(email: string, password: string) {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('gestock_token', res.data.accessToken);
    setUser(res.data.user);
    return res.data.user as AuthUser;
  }

  async function register(name: string, email: string, password: string) {
    const res = await api.post('/auth/register', { name, email, password });
    return res.data as { message: string; verificationCode: string };
  }

  function logout() {
    localStorage.removeItem('gestock_token');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}