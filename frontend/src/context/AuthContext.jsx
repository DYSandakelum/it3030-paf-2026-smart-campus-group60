import { createContext, useState, useEffect } from 'react';
import {
  clearAuthState,
  getBasicAuthCredentials,
  inferUserFromUsername,
  normalizeUsername,
} from '../services/basicAuth';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const credentials = getBasicAuthCredentials();

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else if (credentials?.username) {
      setUser(inferUserFromUsername(credentials.username));
    } else {
      const legacyToken = localStorage.getItem('token');
      if (legacyToken) {
        localStorage.removeItem('token');
      }
    }

    setLoading(false);
  }, []);

  const login = (primary, secondary) => {
    if (typeof primary === 'string' && secondary && typeof secondary === 'object') {
      localStorage.setItem('token', primary);
      localStorage.setItem('user', JSON.stringify(secondary));
      setUser(secondary);
      return;
    }

    const userData = primary;
    const credentials = secondary || {};

    if (credentials.username && credentials.password) {
      localStorage.setItem('authUsername', normalizeUsername(credentials.username));
      localStorage.setItem('authPassword', credentials.password);
    }

    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.removeItem('token');
    setUser(userData);
  };

  const logout = () => {
    clearAuthState();
    setUser(null);
    window.location.href = '/login';
  };

  const isAdmin = () => user?.role === 'ADMIN';
  const isTechnician = () => user?.role === 'TECHNICIAN';
  const isUser = () => user?.role === 'USER';

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      logout,
      isAdmin,
      isTechnician,
      isUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};