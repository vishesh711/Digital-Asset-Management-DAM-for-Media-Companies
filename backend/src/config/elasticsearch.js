const { Client } = require('@elastic/elasticsearch');
const logger = require('../utils/logger');

// Elasticsearch client configuration
const elasticsearchConfig = {
  node: `http://${process.env.ELASTICSEARCH_HOST || 'localhost'}:${process.env.ELASTICSEARCH_PORT || 9200}`,
  auth: {
    username: process.env.ELASTICSEARCH_USERNAME,
    password: process.env.ELASTICSEARCH_PASSWORD,
  },
  maxRetries: 5,
  requestTimeout: 60000,
};

// Initialize Elasticsearch client
const client = new Client(elasticsearchConfig);

// Function to connect to Elasticsearch
const connectElasticsearch = async () => {
  try {
    const response = await client.ping();
    if (response) {
      logger.info('Connected to Elasticsearch');
      return client;
    }
  } catch (error) {
    logger.error('Failed to connect to Elasticsearch:', error);
    throw error;
  }
};

// Function to create index if it doesn't exist
const createIndex = async (indexName, mappings = {}) => {
  try {
    const indexExists = await client.indices.exists({ index: indexName });
    
    if (!indexExists) {
      await client.indices.create({
        index: indexName,
        body: {
          mappings,
        },
      });
      logger.info(`Created Elasticsearch index: ${indexName}`);
    }
    
    return true;
  } catch (error) {
    logger.error(`Error creating Elasticsearch index ${indexName}:`, error);
    throw error;
  }
};

// Function to index a document
const indexDocument = async (indexName, document, id = null) => {
  try {
    const params = {
      index: indexName,
      body: document,
    };
    
    if (id) {
      params.id = id;
    }
    
    const response = await client.index(params);
    return response;
  } catch (error) {
    logger.error(`Error indexing document in ${indexName}:`, error);
    throw error;
  }
};

// Function to search documents
const searchDocuments = async (indexName, query, from = 0, size = 20) => {
  try {
    const response = await client.search({
      index: indexName,
      body: {
        query,
        from,
        size,
      },
    });
    
    return response.body.hits;
  } catch (error) {
    logger.error(`Error searching documents in ${indexName}:`, error);
    throw error;
  }
};

// Function to delete a document
const deleteDocument = async (indexName, id) => {
  try {
    const response = await client.delete({
      index: indexName,
      id,
    });
    
    return response;
  } catch (error) {
    logger.error(`Error deleting document ${id} from ${indexName}:`, error);
    throw error;
  }
};

// Function to get Elasticsearch client
const getElasticsearchClient = () => client;

module.exports = {
  connectElasticsearch,
  createIndex,
  indexDocument,
  searchDocuments,
  deleteDocument,
  getElasticsearchClient,
}; 