const jwt = require('jsonwebtoken');
const { dbGet } = require('./_db');

const JWT_SECRET = process.env.JWT_SECRET || 'pm-ajay-portal-secret-key-2024';

// Authentication middleware
const authenticateToken = (req) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    throw new Error('Access token required');
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

// Role-based authorization middleware
const authorizeRole = (roles) => {
  return (req) => {
    const user = authenticateToken(req);
    if (!roles.includes(user.role)) {
      throw new Error('Insufficient permissions');
    }
    return user;
  };
};

module.exports = { authenticateToken, authorizeRole, JWT_SECRET };