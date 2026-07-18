import React, { createContext, useContext, useState } from 'react';
import { login as loginApi, register as registerApi } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('devhire_user');
    return stored ? JSON.parse(stored) : null;
  });

  const persist = (data) => {
    localStorage.setItem('devhire_token', data.token);
    const userData = { id: data.id, username: data.username, email: data.email, role: data.role };
    localStorage.setItem('devhire_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const login = async (credentials) => {
    const data = await loginApi(credentials);
    return persist(data);
  };

  const register = async (details) => {
    const data = await registerApi(details);
    return persist(data);
  };

  const logout = () => {
    localStorage.removeItem('devhire_token');
    localStorage.removeItem('devhire_user');
    setUser(null);
  };

  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
