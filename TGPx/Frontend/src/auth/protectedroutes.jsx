import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import useAuthStore from '../store/authStore';
import Loading from '../utils/loading';

export const ProtectedRoute = ({ element, requiredRole }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const role = useAuthStore((state) => state.role);
  const loading = useAuthStore((state) => state.loading);
  const initialize = useAuthStore((state) => state.initialize);
  const location = useLocation();

  // Only initialize if loading is null
  useEffect(() => {
    if (loading === null) {
      initialize();
    }
  }, [initialize, loading]);

  // Show loading until initialize finishes
  if (loading === null || loading === true) {
    return <div><Loading/></div>;
  }

  // Not authenticated -> redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role-based protection
  if (requiredRole && !requiredRole.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return element;
};

ProtectedRoute.propTypes = {
  element: PropTypes.node.isRequired,
  requiredRole: PropTypes.arrayOf(PropTypes.string),
};

export default ProtectedRoute;
