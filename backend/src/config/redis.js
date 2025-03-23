const { createClient } = require('redis');
const logger = require('../utils/logger');

// Redis client configuration
const redisConfig = {
  socket: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
  },
  password: process.env.REDIS_PASSWORD || '',
};

// Initialize Redis client
const client = createClient(redisConfig);

// Event handlers for Redis client
client.on('error', (error) => {
  logger.error('Redis Error:', error);
});

client.on('connect', () => {
  logger.info('Redis client connected');
});

client.on('reconnecting', () => {
  logger.info('Redis client reconnecting');
});

client.on('end', () => {
  logger.info('Redis client disconnected');
});

// Function to connect to Redis
const connectRedis = async () => {
  try {
    if (!client.isOpen) {
      await client.connect();
    }
    return client;
  } catch (error) {
    logger.error('Failed to connect to Redis:', error);
    throw error;
  }
};

// Function to disconnect from Redis
const disconnectRedis = async () => {
  try {
    if (client.isOpen) {
      await client.disconnect();
    }
  } catch (error) {
    logger.error('Error disconnecting from Redis:', error);
    throw error;
  }
};

// Function to get Redis client
const getRedisClient = () => client;

// Function to get a value from Redis
const getCache = async (key) => {
  try {
    const value = await client.get(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    logger.error(`Error getting cache for key ${key}:`, error);
    return null;
  }
};

// Function to set a value in Redis
const setCache = async (key, value, expiry = 3600) => {
  try {
    await client.set(key, JSON.stringify(value), { EX: expiry });
    return true;
  } catch (error) {
    logger.error(`Error setting cache for key ${key}:`, error);
    return false;
  }
};

// Function to delete a value from Redis
const deleteCache = async (key) => {
  try {
    await client.del(key);
    return true;
  } catch (error) {
    logger.error(`Error deleting cache for key ${key}:`, error);
    return false;
  }
};

// Function to clear all values from Redis (be cautious with this)
const clearCache = async () => {
  try {
    await client.flushAll();
    return true;
  } catch (error) {
    logger.error('Error clearing cache:', error);
    return false;
  }
};

module.exports = {
  connectRedis,
  disconnectRedis,
  getRedisClient,
  getCache,
  setCache,
  deleteCache,
  clearCache,
}; 