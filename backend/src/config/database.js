const knex = require('knex');
const logger = require('../utils/logger');

// Knex configuration for PostgreSQL
const knexConfig = {
  client: 'pg',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'dam_db',
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    directory: '../migrations',
    tableName: 'knex_migrations',
  },
  seeds: {
    directory: '../seeds',
  },
};

// Initialize knex instance
const db = knex(knexConfig);

// Function to connect to the database
const connectDB = async () => {
  try {
    await db.raw('SELECT 1');
    logger.info('Connected to PostgreSQL database');
    return db;
  } catch (error) {
    logger.error('Failed to connect to PostgreSQL database:', error);
    throw error;
  }
};

// Function to close the database connection
const closeDB = async () => {
  try {
    await db.destroy();
    logger.info('Disconnected from PostgreSQL database');
  } catch (error) {
    logger.error('Error closing PostgreSQL connection:', error);
    throw error;
  }
};

// Function to get the database connection
const getDB = () => db;

module.exports = {
  connectDB,
  closeDB,
  getDB,
  knexConfig,
}; 