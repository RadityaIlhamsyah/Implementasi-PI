//Frotend/src/routes/PrivateAdminRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateAdminRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  // Tambahkan pengecekan role admin jika diperlukan
  if (user.role !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default PrivateAdminRoute;
