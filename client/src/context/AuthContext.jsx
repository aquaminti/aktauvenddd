import { createContext, useCallback, useEffect, useState } from 'react';
import { loginUser, registerUser, logoutUser, fetchCurrentUser } from '../services/api';
import { storage } from '../services/storage';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => storage.getUser());
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function checkSession() {
      try {
        const data = await fetchCurrentUser();
        if (isMounted && data.success) {
          setUser(data.user);
          storage.setUser(data.user);
        }
      } catch (err) {
        if (isMounted && storage.getUser()) {
          if (err.message.includes('недействительна') || err.message.includes('истекла')) {
            setUser(null);
            storage.clearUser();
          }
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    checkSession();
    return () => {
      isMounted = false;
    };
  }, []);

  const register = useCallback(async (payload) => {
    setAuthError('');
    const data = await registerUser(payload);
    setUser(data.user);
    storage.setUser(data.user);
    if (data.token) storage.setToken(data.token);
    return data.user;
  }, []);

  const login = useCallback(async (payload) => {
    setAuthError('');
    const data = await loginUser(payload);
    setUser(data.user);
    storage.setUser(data.user);
    if (data.token) storage.setToken(data.token);
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } catch {

    }
    setUser(null);
    storage.clearUser();
    storage.clearToken();
  }, []);

  const value = {
    user,
    isAuthenticated: Boolean(user),
    isLoading,
    authError,
    setAuthError,
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
