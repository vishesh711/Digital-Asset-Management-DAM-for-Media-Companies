const { gql } = require('apollo-server-express');

const assetSchema = gql`
  # Asset status enum
  enum AssetStatus {
    UPLOADING
    PROCESSING
    READY
    ERROR
    ARCHIVED
    DELETED
  }

  # Asset type
  type Asset {
    id: ID!
    tenantId: ID!
    originalFilename: String!
    fileSize: Int!
    mimeType: String!
    extension: String!
    status: AssetStatus!
    uploadedBy: User
    createdAt: DateTime!
    updatedAt: DateTime!
    metadata: Metadata
    tags: [Tag]
    versions: [AssetVersion]
    collections: [Collection]
    licenses: [License]
    previewUrl: String
    downloadUrl: String
  }

  # Asset version type
  type AssetVersion {
    id: ID!
    assetId: ID!
    versionNumber: Int!
    fileLocation: String!
    fileSize: Int!
    createdBy: User
    createdAt: DateTime!
    previewUrl: String
    downloadUrl: String
  }

  # Asset response
  type AssetResponse implements Response {
    success: Boolean!
    message: String
    asset: Asset
  }

  # Multiple assets response
  type AssetsResponse implements Response {
    success: Boolean!
    message: String
    assets: [Asset]
    totalCount: Int
  }

  # Asset version response
  type AssetVersionResponse implements Response {
    success: Boolean!
    message: String
    version: AssetVersion
  }

  # Create asset input
  input CreateAssetInput {
    originalFilename: String!
    collectionIds: [ID]
  }

  # Update asset input
  input UpdateAssetInput {
    originalFilename: String
    status: AssetStatus
    collectionIds: [ID]
  }

  # Asset search input
  input AssetSearchInput {
    query: String
    collectionIds: [ID]
    tagIds: [ID]
    dateFrom: DateTime
    dateTo: DateTime
    fileTypes: [String]
    statuses: [AssetStatus]
    uploadedBy: ID
  }

  # Asset upload completed input
  input AssetUploadCompletedInput {
    assetId: ID!
    fileSize: Int!
    mimeType: String!
    extension: String!
  }

  # Assets batch operation input
  input AssetsBatchOperationInput {
    assetIds: [ID!]!
    operation: AssetBatchOperation!
    targetCollectionId: ID
    targetStatus: AssetStatus
  }

  # Asset batch operation enum
  enum AssetBatchOperation {
    MOVE_TO_COLLECTION
    REMOVE_FROM_COLLECTION
    TAG
    UNTAG
    CHANGE_STATUS
    DELETE
  }

  # Extend the Query type
  extend type Query {
    # Get asset by ID
    asset(id: ID!): AssetResponse

    # Get all assets with filtering and pagination
    assets(
      search: AssetSearchInput
      pagination: PaginationInput
      sort: SortInput
    ): AssetsResponse

    # Get all versions of an asset
    assetVersions(assetId: ID!): [AssetVersion]
  }

  # Extend the Mutation type
  extend type Mutation {
    # Create a new asset (initial entry before upload)
    createAsset(input: CreateAssetInput!): AssetResponse

    # Update asset properties
    updateAsset(id: ID!, input: UpdateAssetInput!): AssetResponse

    # Asset upload completed
    assetUploadCompleted(input: AssetUploadCompletedInput!): AssetResponse
    
    # Create a new version of an asset
    createAssetVersion(assetId: ID!): AssetVersionResponse

    # Delete asset (soft delete)
    deleteAsset(id: ID!): AssetResponse

    # Permanently delete asset
    permanentlyDeleteAsset(id: ID!): AssetResponse

    # Batch operation on multiple assets
    assetsBatchOperation(input: AssetsBatchOperationInput!): AssetsResponse
  }
`;

module.exports = assetSchema; 