/**
 * Simple logger utility
 * In a production environment, this would be replaced with a more robust solution
 * like Winston or Pino
 */

const logger = {
  info: (message, ...args) => {
    console.log(`[INFO] ${message}`, ...args);
  },
  
  debug: (message, ...args) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[DEBUG] ${message}`, ...args);
    }
  },
  
  warn: (message, ...args) => {
    console.warn(`[WARN] ${message}`, ...args);
  },
  
  error: (message, ...args) => {
    console.error(`[ERROR] ${message}`, ...args);
  }
};

module.exports = logger; 