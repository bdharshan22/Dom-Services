import React, { createContext, useState, useContext, useEffect } from 'react';
import { api } from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await api.get('/auth/me');
          setUser(res.data);
        } catch (err) {
          console.error('Failed to load user', err);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  // Login without role param - backend determines role automatically
  const login = async (email, password) => {
    try {
      console.log('Attempting login with:', { email, apiBaseURL: api.defaults.baseURL });
      const res = await api.post('/auth/login', { email, password });
      console.log('Login response:', res.data);
      localStorage.setItem('token', res.data.token);
      // Store user with role from backend
      setUser(res.data.user || res.data);
      return res.data.user || res.data;
    } catch (err) {
      console.error('Login failed:', err.response?.data || err.message);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // Accept role param for register
  const register = async (name, email, password, mobile, location, role) => {
    try {
      const res = await api.post('/auth/register', { name, email, password, mobile, location, role });
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user || res.data);
      return res.data.user || res.data;
    } catch (err) {
      console.error('Registration failed', err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);