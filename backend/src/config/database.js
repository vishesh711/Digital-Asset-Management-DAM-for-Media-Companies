/**
 * Database configuration
 * Currently a placeholder implementation
 */
const mongoose = require('mongoose');
const logger = require('../utils/logger');

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/dam';

// Connect to MongoDB
const connectDB = async () => {
  try {
    if (process.env.NODE_ENV === 'test') {
      logger.info('Test environment detected, skipping database connection');
      return;
    }
    
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    logger.info('MongoDB connected successfully');
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    logger.warn('Continuing without MongoDB - this is acceptable in development mode with mock data');
    // Don't exit in development mode
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

// Get database connection
const getDB = () => {
  return mongoose.connection;
};

module.exports = {
  connectDB,
  getDB
}; 