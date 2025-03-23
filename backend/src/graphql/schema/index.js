const { gql } = require('apollo-server-express');

// Base schema with common types and queries
const baseSchema = gql`
  # Custom scalar types
  scalar DateTime
  scalar JSON

  # Base types
  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }

  type Subscription {
    _: Boolean
  }

  # Common response type
  interface Response {
    success: Boolean!
    message: String
  }

  # Pagination input
  input PaginationInput {
    page: Int
    limit: Int
  }

  # Sorting input
  input SortInput {
    field: String!
    direction: SortDirection!
  }

  # Sort direction enum
  enum SortDirection {
    ASC
    DESC
  }
`;

// Import all type definitions
const tenantSchema = require('./tenant');
const userSchema = require('./user');
const assetSchema = require('./asset');
const collectionSchema = require('./collection');
const metadataSchema = require('./metadata');
const licenseSchema = require('./license');
const tagSchema = require('./tag');
const distributionSchema = require('./distribution');
const analyticsSchema = require('./analytics');

// Combine all schemas
const typeDefs = [
  baseSchema,
  tenantSchema,
  userSchema,
  assetSchema,
  collectionSchema,
  metadataSchema,
  licenseSchema,
  tagSchema,
  distributionSchema,
  analyticsSchema,
];

module.exports = typeDefs; 