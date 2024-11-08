// authMiddleware.js
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables from .env file

const JWT_SECRET = process.env.JWT_SECRET; // Use the secret from the environment variable

const verifyRole = (requiredRole) => {
  return (req, res, next) => {
    const { accessToken } = req.cookies;

    if (!accessToken) {
      return res.status(401).json({ success: false, message: 'No access token provided' });
    }

    jwt.verify(accessToken, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ success: false, message: 'Invalid token' });
      }

      const userRole = decoded.role;

      // Role checks
      if (requiredRole === 'admin' && userRole !== 'admin') {
        return res.status(403).json({ success: false, message: 'Access denied: Admins only' });
      }

      if (requiredRole === 'member' && userRole !== 'member' && userRole !== 'admin') {
        return res.status(403).json({ success: false, message: 'Access denied: Members only' });
      }

      req.user = decoded; // Attach user info to request
      next(); // Proceed to the next middleware or route handler
    });
  };
};

module.exports = {
  verifyRole,
};
