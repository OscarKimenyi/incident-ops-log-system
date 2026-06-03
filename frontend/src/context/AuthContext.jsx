import { createContext, useContext, useState } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  const parseResponse = (data) => {
    // If data is already an object, return it directly
    if (typeof data === 'object' && data !== null) return data;

    // If data is a string with junk before JSON, extract the JSON part
    if (typeof data === 'string') {
      const jsonStart = data.indexOf('{');
      if (jsonStart !== -1) {
        const jsonString = data.substring(jsonStart);
        return JSON.parse(jsonString);
      }
    }

    throw new Error('Invalid response format');
  };

  const login = async (email, password) => {
    const response = await api.post('/login', { email, password });
    const parsed = parseResponse(response.data);
    const { user, token } = parsed;

    if (!token) throw new Error('No token received from server');

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
    return user;
  };

  const logout = async () => {
    try {
      await api.post('/logout');
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  const isAdmin = () => user?.role === 'admin';
  const isOperator = () => user?.role === 'operator' || user?.role === 'admin';
  const isReporter = () => user?.role === 'reporter';

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin, isOperator, isReporter }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}