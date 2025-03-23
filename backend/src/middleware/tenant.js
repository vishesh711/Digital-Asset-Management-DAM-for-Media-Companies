const { getDB } = require('../config/database');
const logger = require('../utils/logger');
const { getCache, setCache } = require('../config/redis');

/**
 * Middleware to determine and attach tenant context to the request
 * Uses multiple strategies to identify the tenant:
 * 1. Custom HTTP header (X-Tenant-ID)
 * 2. Domain/subdomain based identification
 * 3. JWT token tenant information
 * 4. API key tenant mapping
 */
const tenantMiddleware = async (req, res, next) => {
  try {
    let tenantId = null;
    
    // Strategy 1: Check for tenant ID in custom header
    if (req.headers['x-tenant-id']) {
      tenantId = req.headers['x-tenant-id'];
      logger.debug(`Tenant ID found in header: ${tenantId}`);
    }
    
    // Strategy 2: Domain/subdomain based identification
    if (!tenantId && req.headers.host) {
      const host = req.headers.host.split(':')[0]; // Remove port if present
      
      // Cache key for domain lookup
      const cacheKey = `tenant:domain:${host}`;
      
      // Try to get from cache first
      let tenantInfo = await getCache(cacheKey);
      
      if (!tenantInfo) {
        // Query the database for domain-tenant mapping
        const db = getDB();
        const result = await db('tenant_domains')
          .select('tenant_id')
          .where('domain', host)
          .first();
        
        if (result) {
          tenantId = result.tenant_id;
          // Cache the result
          await setCache(cacheKey, { tenantId }, 3600); // Cache for 1 hour
          logger.debug(`Tenant ID found by domain (${host}): ${tenantId}`);
        }
      } else {
        tenantId = tenantInfo.tenantId;
        logger.debug(`Tenant ID found in cache for domain (${host}): ${tenantId}`);
      }
    }
    
    // Strategy 3: JWT token tenant information (will be extracted in auth middleware)
    // This is handled in the auth middleware, but we can access it if auth has already run
    if (!tenantId && req.user && req.user.tenantId) {
      tenantId = req.user.tenantId;
      logger.debug(`Tenant ID found in JWT token: ${tenantId}`);
    }
    
    // Strategy 4: API key tenant mapping
    if (!tenantId && req.headers['x-api-key']) {
      const apiKey = req.headers['x-api-key'];
      
      // Cache key for API key lookup
      const cacheKey = `tenant:apikey:${apiKey}`;
      
      // Try to get from cache first
      let apiKeyInfo = await getCache(cacheKey);
      
      if (!apiKeyInfo) {
        // Query the database for API key mapping
        const db = getDB();
        const result = await db('api_keys')
          .select('tenant_id')
          .where('key', apiKey)
          .where('is_active', true)
          .first();
        
        if (result) {
          tenantId = result.tenant_id;
          // Cache the result
          await setCache(cacheKey, { tenantId }, 3600); // Cache for 1 hour
          logger.debug(`Tenant ID found by API key: ${tenantId}`);
        }
      } else {
        tenantId = apiKeyInfo.tenantId;
        logger.debug(`Tenant ID found in cache for API key: ${tenantId}`);
      }
    }
    
    // If tenant ID is found, load tenant settings and attach to request
    if (tenantId) {
      // Cache key for tenant settings
      const cacheKey = `tenant:settings:${tenantId}`;
      
      // Try to get from cache first
      let tenantSettings = await getCache(cacheKey);
      
      if (!tenantSettings) {
        // Query the database for tenant settings
        const db = getDB();
        const tenant = await db('tenants')
          .select('*')
          .where('tenant_id', tenantId)
          .where('is_active', true)
          .first();
        
        if (tenant) {
          // Cache the settings
          tenantSettings = tenant;
          await setCache(cacheKey, tenantSettings, 3600); // Cache for 1 hour
        } else {
          // Tenant not found or not active
          logger.warn(`Tenant not found or not active: ${tenantId}`);
          return res.status(404).json({ error: 'Tenant not found or not active' });
        }
      }
      
      // Attach tenant information to the request
      req.tenant = {
        id: tenantId,
        name: tenantSettings.name,
        settings: tenantSettings.settings || {},
        createdAt: tenantSettings.created_at,
      };
      
      logger.info(`Request authenticated for tenant: ${tenantSettings.name} (${tenantId})`);
    } else {
      // Use default tenant for public routes or fallback
      tenantId = process.env.DEFAULT_TENANT_ID || 'default';
      
      // Cache key for default tenant settings
      const cacheKey = `tenant:settings:${tenantId}`;
      
      // Try to get from cache first
      let tenantSettings = await getCache(cacheKey);
      
      if (!tenantSettings) {
        // Query the database for default tenant settings
        const db = getDB();
        const tenant = await db('tenants')
          .select('*')
          .where('tenant_id', tenantId)
          .where('is_active', true)
          .first();
        
        if (tenant) {
          // Cache the settings
          tenantSettings = tenant;
          await setCache(cacheKey, tenantSettings, 3600); // Cache for 1 hour
        } else {
          // Default tenant not found or not active
          logger.error(`Default tenant not found or not active: ${tenantId}`);
          return res.status(500).json({ error: 'Default tenant configuration error' });
        }
      }
      
      // Attach default tenant information to the request
      req.tenant = {
        id: tenantId,
        name: tenantSettings.name,
        settings: tenantSettings.settings || {},
        createdAt: tenantSettings.created_at,
        isDefault: true,
      };
      
      logger.debug(`Using default tenant: ${tenantSettings.name} (${tenantId})`);
    }
    
    next();
  } catch (error) {
    logger.error('Error in tenant middleware:', error);
    res.status(500).json({ error: 'Internal server error in tenant resolution' });
  }
};

module.exports = {
  tenantMiddleware,
}; 