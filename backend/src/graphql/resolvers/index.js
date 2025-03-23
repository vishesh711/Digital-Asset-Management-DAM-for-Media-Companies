const { GraphQLScalarType, Kind } = require('graphql');

// Import all resolvers
const tenantResolvers = require('./tenant');
const userResolvers = require('./user');
const assetResolvers = require('./asset');
const collectionResolvers = require('./collection');
const metadataResolvers = require('./metadata');
const licenseResolvers = require('./license');
const tagResolvers = require('./tag');
const distributionResolvers = require('./distribution');
const analyticsResolvers = require('./analytics');

// Define DateTime scalar
const dateTimeScalar = new GraphQLScalarType({
  name: 'DateTime',
  description: 'DateTime custom scalar type',
  serialize(value) {
    return value instanceof Date ? value.toISOString() : value;
  },
  parseValue(value) {
    return new Date(value);
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    return null;
  },
});

// Define JSON scalar
const jsonScalar = new GraphQLScalarType({
  name: 'JSON',
  description: 'JSON custom scalar type',
  serialize(value) {
    return value;
  },
  parseValue(value) {
    return value;
  },
  parseLiteral(ast) {
    switch (ast.kind) {
      case Kind.STRING:
        return JSON.parse(ast.value);
      case Kind.OBJECT:
        return ast.fields.reduce((acc, field) => {
          acc[field.name.value] = parseLiteral(field.value);
          return acc;
        }, {});
      case Kind.INT:
      case Kind.FLOAT:
        return parseFloat(ast.value);
      case Kind.BOOLEAN:
        return ast.value;
      case Kind.LIST:
        return ast.values.map(parseLiteral);
      default:
        return null;
    }
  },
});

// Merge all resolvers
const resolvers = {
  // Scalars
  DateTime: dateTimeScalar,
  JSON: jsonScalar,
  
  // Query
  Query: {
    ...tenantResolvers.Query,
    ...userResolvers.Query,
    ...assetResolvers.Query,
    ...collectionResolvers.Query,
    ...metadataResolvers.Query,
    ...licenseResolvers.Query,
    ...tagResolvers.Query,
    ...distributionResolvers.Query,
    ...analyticsResolvers.Query,
  },
  
  // Mutation
  Mutation: {
    ...tenantResolvers.Mutation,
    ...userResolvers.Mutation,
    ...assetResolvers.Mutation,
    ...collectionResolvers.Mutation,
    ...metadataResolvers.Mutation,
    ...licenseResolvers.Mutation,
    ...tagResolvers.Mutation,
    ...distributionResolvers.Mutation,
    ...analyticsResolvers.Mutation,
  },
  
  // Type resolvers
  Tenant: tenantResolvers.Tenant,
  Brand: tenantResolvers.Brand,
  User: userResolvers.User,
  Role: userResolvers.Role,
  Asset: assetResolvers.Asset,
  AssetVersion: assetResolvers.AssetVersion,
  Collection: collectionResolvers.Collection,
  Metadata: metadataResolvers.Metadata,
  MetadataSchema: metadataResolvers.MetadataSchema,
  License: licenseResolvers.License,
  Tag: tagResolvers.Tag,
  DistributionChannel: distributionResolvers.DistributionChannel,
  Distribution: distributionResolvers.Distribution,
  AssetUsage: analyticsResolvers.AssetUsage,
};

module.exports = resolvers; 