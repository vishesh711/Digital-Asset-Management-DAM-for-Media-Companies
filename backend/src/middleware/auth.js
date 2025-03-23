const jwt = require('jsonwebtoken');
const { expressjwt } = require('express-jwt');
const logger = require('../utils/logger');
const { getDB } = require('../config/database');
const { getCache, setCache } = require('../config/redis');

// JWT secret key
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Define paths that don't require authentication
const unprotectedPaths = [
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/refresh-token',
  '/api/auth/forgot-password',
  '/api/auth/reset-password',
  '/health',
  '/previews',
];

// Check if path is unprotected
const isUnprotectedPath = (path) => {
  return unprotectedPaths.some(prefix => path.startsWith(prefix));
};

// Create JWT middleware using express-jwt
const jwtMiddleware = expressjwt({
  secret: JWT_SECRET,
  algorithms: ['HS256'],
  credentialsRequired: false, // Don't require JWT for unprotected paths
});

// Main authentication middleware
const authMiddleware = async (req, res, next) => {
  try {
    // Skip authentication for unprotected paths
    if (isUnprotectedPath(req.path)) {
      return next();
    }
    
    // API key authentication (alternative to JWT)
    if (req.headers['x-api-key']) {
      const apiKey = req.headers['x-api-key'];
      
      // Cache key for API key auth
      const cacheKey = `auth:apikey:${apiKey}`;
      
      // Try to get from cache first
      let apiKeyData = await getCache(cacheKey);
      
      if (!apiKeyData) {
        // Query the database for API key
        const db = getDB();
        const result = await db('api_keys')
          .select('api_keys.*', 'users.role_id')
          .join('users', 'api_keys.user_id', 'users.user_id')
          .where('api_keys.key', apiKey)
          .where('api_keys.is_active', true)
          .first();
        
        if (result) {
          // Get permissions for this role
          const permissions = await db('role_permissions')
            .select('permissions.name', 'permissions.resource', 'permissions.action')
            .join('permissions', 'role_permissions.permission_id', 'permissions.permission_id')
            .where('role_permissions.role_id', result.role_id);
          
          apiKeyData = {
            userId: result.user_id,
            tenantId: result.tenant_id,
            roleId: result.role_id,
            permissions: permissions,
          };
          
          // Cache the result
          await setCache(cacheKey, apiKeyData, 3600); // Cache for 1 hour
        } else {
          logger.warn(`Invalid API key: ${apiKey}`);
          return res.status(401).json({ error: 'Invalid API key' });
        }
      }
      
      // Attach user data to request
      req.user = {
        id: apiKeyData.userId,
        tenantId: apiKeyData.tenantId,
        roleId: apiKeyData.roleId,
        permissions: apiKeyData.permissions,
        authMethod: 'api-key',
      };
      
      logger.debug(`Request authenticated using API key for user ID: ${apiKeyData.userId}`);
      return next();
    }
    
    // Apply JWT middleware
    return jwtMiddleware(req, res, async (err) => {
      if (err) {
        logger.warn('JWT authentication error:', err.message);
        return res.status(401).json({ error: 'Unauthorized', message: err.message });
      }
      
      // If we have a JWT user, load permissions
      if (req.auth) {
        const userId = req.auth.id;
        const tenantId = req.auth.tenantId;
        
        // Cache key for user permissions
        const cacheKey = `auth:permissions:${userId}:${tenantId}`;
        
        // Try to get from cache first
        let permissions = await getCache(cacheKey);
        
        if (!permissions) {
          // Query the database for user permissions
          const db = getDB();
          const user = await db('users')
            .select('role_id')
            .where('user_id', userId)
            .where('tenant_id', tenantId)
            .where('is_active', true)
            .first();
          
          if (!user) {
            logger.warn(`User not found or not active: ${userId} in tenant ${tenantId}`);
            return res.status(401).json({ error: 'User not found or not active' });
          }
          
          // Get permissions for this role
          permissions = await db('role_permissions')
            .select('permissions.name', 'permissions.resource', 'permissions.action')
            .join('permissions', 'role_permissions.permission_id', 'permissions.permission_id')
            .where('role_permissions.role_id', user.role_id);
          
          // Cache the result
          await setCache(cacheKey, permissions, 3600); // Cache for 1 hour
        }
        
        // Attach full user data to request
        req.user = {
          id: userId,
          tenantId: tenantId,
          roleId: req.auth.roleId,
          email: req.auth.email,
          name: req.auth.name,
          permissions: permissions,
          authMethod: 'jwt',
        };
        
        logger.debug(`Request authenticated using JWT for user: ${req.auth.email}`);
      }
      
      next();
    });
  } catch (error) {
    logger.error('Error in auth middleware:', error);
    res.status(500).json({ error: 'Internal server error in authentication' });
  }
};

// Function to generate JWT token
const generateToken = (user) => {
  try {
    const payload = {
      id: user.user_id,
      email: user.email,
      name: user.name,
      tenantId: user.tenant_id,
      roleId: user.role_id,
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
      id: user.user_id,
      tenantId: user.tenant_id,
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

// Function to verify refresh token
const verifyRefreshToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET || 'your_refresh_token_secret');
    return decoded;
  } catch (error) {
    logger.error('Error verifying refresh token:', error);
    throw error;
  }
};

module.exports = {
  authMiddleware,
  generateToken,
  generateRefreshToken,
  verifyRefreshToken,
}; 