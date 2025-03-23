/**
 * Tenant middleware to extract and validate tenant information from requests
 */
const logger = require('../utils/logger');

// Placeholder function to get tenant from subdomain
const getTenantFromSubdomain = async (subdomain) => {
  // TODO: Implement actual tenant lookup from database
  // This is a placeholder implementation
  
  if (subdomain === 'demo') {
    return {
      id: '1',
      name: 'Demo Tenant',
      subdomain: 'demo',
      isActive: true,
      settings: {
        theme: 'light',
        storageLimit: 5000000000, // 5GB
        userLimit: 10
      }
    };
  }
  
  return null;
};

// Placeholder function to get tenant from header
const getTenantFromHeader = async (tenantId) => {
  // TODO: Implement actual tenant lookup from database
  // This is a placeholder implementation
  
  if (tenantId === '1') {
    return {
      id: '1',
      name: 'Demo Tenant',
      subdomain: 'demo',
      isActive: true,
      settings: {
        theme: 'light',
        storageLimit: 5000000000, // 5GB
        userLimit: 10
      }
    };
  }
  
  return null;
};

// Tenant middleware
const tenantMiddleware = async (req, res, next) => {
  try {
    let tenant = null;
    
    // Try to get tenant from header
    const tenantId = req.headers['x-tenant-id'];
    if (tenantId) {
      tenant = await getTenantFromHeader(tenantId);
    }
    
    // If no tenant from header, try to get from subdomain
    if (!tenant) {
      const host = req.headers.host;
      if (host && host.includes('.')) {
        const subdomain = host.split('.')[0];
        if (subdomain !== 'www' && subdomain !== 'api') {
          tenant = await getTenantFromSubdomain(subdomain);
        }
      }
    }
    
    // If tenant found, attach to request
    if (tenant) {
      req.tenant = tenant;
    }
    
    // Continue with request
    next();
  } catch (error) {
    // Log error but continue without tenant
    logger.error('Error in tenant middleware:', error);
    next();
  }
};

module.exports = {
  tenantMiddleware
}; 