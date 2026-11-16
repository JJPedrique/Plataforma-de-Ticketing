import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const session = authService.getSession();
      if (!session) {
        if (mounted) setLoading(false);
        return;
      }
      try {
        const refreshed = await authService.refreshSession();
        if (mounted) setUser(refreshed || null);
      } catch {
        if (mounted) setUser(session);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const login = (session) => {
    setUser(session);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const refreshed = await authService.refreshSession();
      setUser(refreshed || null);
      return refreshed;
    } catch {
      const session = authService.getSession();
      setUser(session || null);
      return session;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);