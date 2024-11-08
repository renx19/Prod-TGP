// AuthGuard.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../authStore'; // Import your Zustand store

const AuthGuard = ({ children, requiredRole, requiresAuth }) => {
  const { isAuthenticated, role } = useAuthStore((state) => ({ isAuthenticated: state.isAuthenticated, role: state.role }));

  if (requiresAuth) {
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }

    if (requiredRole === 'admin' && role !== 'admin') {
      return <Navigate to="/unauthorized" />;
    }

    if (requiredRole === 'member' && role !== 'member') {
      return <Navigate to="/unauthorized" />;
    }
  }

  return children;
};

export default AuthGuard;