import { Navigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types'; // Import PropTypes
import useAuthStore from '../store/authStore'; // Adjust the path

export const ProtectedRoute = ({ element, requiredRole }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const role = useAuthStore((state) => state.role);
  const loading = useAuthStore((state) => state.loading);
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>; // Show loading message while checking auth
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} />; // Store the intended route
  }

  if (requiredRole && !requiredRole.includes(role)) {
    return <Navigate to="/unauthorized" />; // Redirect if user doesn't have the required role
  }

  return element; // Render the protected component if authenticated and authorized
};

// Define prop types for the component
ProtectedRoute.propTypes = {
  element: PropTypes.node.isRequired, // 'element' should be a React node and is required
  requiredRole: PropTypes.arrayOf(PropTypes.string), // 'requiredRole' should be an array of strings
};

export default ProtectedRoute;