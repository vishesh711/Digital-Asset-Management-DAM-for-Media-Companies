const { gql } = require('apollo-server-express');

const collectionSchema = gql`
  # Collection type
  type Collection {
    id: ID!
    tenantId: ID!
    brandId: ID!
    name: String!
    description: String
    parentId: ID
    path: String!
    createdAt: DateTime!
    updatedAt: DateTime!
    brand: Brand
    parent: Collection
    children: [Collection]
    assets: [Asset]
    assetCount: Int
  }

  # Collection response
  type CollectionResponse implements Response {
    success: Boolean!
    message: String
    collection: Collection
  }

  # Multiple collections response
  type CollectionsResponse implements Response {
    success: Boolean!
    message: String
    collections: [Collection]
    totalCount: Int
  }

  # Create collection input
  input CreateCollectionInput {
    name: String!
    description: String
    parentId: ID
    brandId: ID!
  }

  # Update collection input
  input UpdateCollectionInput {
    name: String
    description: String
    parentId: ID
  }

  # Collection search input
  input CollectionSearchInput {
    query: String
    brandIds: [ID]
    parentId: ID
    includeEmpty: Boolean
  }

  # Extend the Query type
  extend type Query {
    # Get collection by ID
    collection(id: ID!): CollectionResponse

    # Get all collections with filtering and pagination
    collections(
      search: CollectionSearchInput
      pagination: PaginationInput
      sort: SortInput
    ): CollectionsResponse

    # Get collection tree structure (hierarchical)
    collectionTree(brandId: ID, rootOnly: Boolean): [Collection]
  }

  # Extend the Mutation type
  extend type Mutation {
    # Create a new collection
    createCollection(input: CreateCollectionInput!): CollectionResponse

    # Update collection
    updateCollection(id: ID!, input: UpdateCollectionInput!): CollectionResponse

    # Delete collection
    deleteCollection(id: ID!): CollectionResponse

    # Add assets to collection
    addAssetsToCollection(collectionId: ID!, assetIds: [ID!]!): CollectionResponse

    # Remove assets from collection
    removeAssetsFromCollection(collectionId: ID!, assetIds: [ID!]!): CollectionResponse

    # Move collection to different parent
    moveCollection(id: ID!, newParentId: ID): CollectionResponse
  }
`;

module.exports = collectionSchema; 