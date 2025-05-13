// === Front-End/context/AuthContext.jsx ===
import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await api.get('/api/auth/me', { withCredentials: true });
        setUser(response.data);
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (credentials) => {
    const response = await api.post('/api/auth/login', credentials, { withCredentials: true });
    const loggedInUser = response.data;
    setUser(loggedInUser);
    if (loggedInUser.role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/');
    }
  };

  const logout = async () => {
    await api.post('/api/auth/logout', {}, { withCredentials: true });
    setUser(null);
    navigate('/login');
  };

  return <AuthContext.Provider value={{ user, login, logout, loading }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
