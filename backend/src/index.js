require('dotenv').config();
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const http = require('http');

// Import custom modules
const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');
const { tenantMiddleware } = require('./middleware/tenant');
const { authMiddleware } = require('./middleware/auth');
const logger = require('./utils/logger');
const routes = require('./routes');
const { connectDB } = require('./config/database');
const { connectElasticsearch } = require('./config/elasticsearch');
const { connectRedis } = require('./config/redis');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 4000;

// Apply middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Apply tenant middleware before routes
app.use(tenantMiddleware);

// Apply auth middleware
app.use(authMiddleware);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Apply API routes
app.use('/api', routes);

// Static files for file previews
app.use('/previews', express.static(path.join(__dirname, '../uploads/previews')));

// Initialize Apollo Server
async function startApolloServer() {
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      // Pass tenant and user context to resolvers
      return {
        tenant: req.tenant,
        user: req.user
      };
    },
    formatError: (error) => {
      // Log errors
      logger.error('GraphQL Error:', error);
      
      // Return formatted error
      return {
        message: error.message,
        path: error.path,
        extensions: error.extensions
      };
    }
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app, path: '/graphql' });

  // Create HTTP server
  const httpServer = http.createServer(app);

  // Start server
  httpServer.listen(PORT, async () => {
    // Connect to database
    await connectDB();
    
    // Connect to Elasticsearch
    await connectElasticsearch();
    
    // Connect to Redis
    await connectRedis();
    
    logger.info(`Server running at http://localhost:${PORT}`);
    logger.info(`GraphQL endpoint at http://localhost:${PORT}${apolloServer.graphqlPath}`);
  });
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  logger.error('Unhandled Rejection:', error);
  process.exit(1);
});

// Start server
startApolloServer().catch((error) => {
  logger.error('Failed to start server:', error);
  process.exit(1);
}); 