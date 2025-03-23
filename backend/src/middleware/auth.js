const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

// JWT secret key
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Placeholder function to get user by ID
const getUserById = async (userId) => {
  // TODO: Implement actual user lookup from database
  // This is a placeholder implementation
  
  if (userId === '1') {
    return {
      id: '1',
      tenantId: '1',
      email: 'admin@example.com',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      isActive: true
    };
  }
  
  return null;
};

// Authentication middleware
const authMiddleware = async (req, res, next) => {
  try {
    // Skip auth check for public routes
    const publicRoutes = [
      '/health',
      '/api/auth/login',
      '/api/auth/register',
      '/api/auth/forgot-password',
      '/api/auth/reset-password',
      '/graphql'  // Public access to GraphQL (queries handled internally)
    ];
    
    // Check if route path is in public routes
    if (publicRoutes.some(route => req.path.includes(route))) {
      return next();
    }
    
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.user = null;
      return next();
    }
    
    // Extract token
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Get user from database
    const user = await getUserById(decoded.userId);
    
    // If user not found or inactive
    if (!user || !user.isActive) {
      req.user = null;
      return next();
    }
    
    // Attach user to request
    req.user = user;
    
    // Continue with request
    next();
  } catch (error) {
    // Token invalid or expired
    logger.error('Auth error:', error);
    req.user = null;
    next();
  }
};

// Function to generate JWT token
const generateToken = (user) => {
  try {
    const payload = {
      userId: user.id,
      email: user.email,
      name: user.firstName + ' ' + user.lastName,
      tenantId: user.tenantId,
      role: user.role,
    };
    
    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    });
    
    return token;
  } catch (error) {
    logger.error('Error generating JWT token:', error);
    throw error;
  }
};

// Function to generate refresh token
const generateRefreshToken = (user) => {
  try {
    const payload = {
      userId: user.id,
      tenantId: user.tenantId,
      tokenType: 'refresh',
    };
    
    const token = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET || 'your_refresh_token_secret', {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
    });
    
    return token;
  } catch (error) {
    logger.error('Error generating refresh token:', error);
    throw error;
  }
};

module.exports = {
  authMiddleware,
  generateToken,
  generateRefreshToken
}; 