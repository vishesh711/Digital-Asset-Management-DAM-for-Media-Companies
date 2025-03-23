const { gql } = require('apollo-server-express');

const metadataSchema = gql`
  # Field type enum
  enum SchemaFieldType {
    TEXT
    NUMBER
    DATE
    BOOLEAN
    SELECT
    MULTI_SELECT
    OBJECT
    ARRAY
  }

  # Metadata schema type
  type MetadataSchema {
    id: ID!
    tenantId: ID!
    name: String!
    description: String
    fields: [SchemaField]
    isRequired: Boolean!
    appliesTo: [String] # Asset types this schema applies to (e.g., "image", "video")
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  # Schema field type
  type SchemaField {
    id: ID!
    schemaId: ID!
    name: String!
    label: String!
    description: String
    type: SchemaFieldType!
    isRequired: Boolean!
    defaultValue: JSON
    options: JSON # For SELECT/MULTI_SELECT fields
    order: Int
  }

  # Metadata type
  type Metadata {
    id: ID!
    assetId: ID!
    schemaId: ID!
    data: JSON!
    schema: MetadataSchema
    asset: Asset
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  # Metadata schema response
  type MetadataSchemaResponse implements Response {
    success: Boolean!
    message: String
    schema: MetadataSchema
  }

  # Multiple metadata schemas response
  type MetadataSchemasResponse implements Response {
    success: Boolean!
    message: String
    schemas: [MetadataSchema]
    totalCount: Int
  }

  # Metadata response
  type MetadataResponse implements Response {
    success: Boolean!
    message: String
    metadata: Metadata
  }

  # Multiple metadata response
  type MetadatasResponse implements Response {
    success: Boolean!
    message: String
    metadatas: [Metadata]
    totalCount: Int
  }

  # Schema field input
  input SchemaFieldInput {
    name: String!
    label: String!
    description: String
    type: SchemaFieldType!
    isRequired: Boolean!
    defaultValue: JSON
    options: JSON
    order: Int
  }

  # Create metadata schema input
  input CreateMetadataSchemaInput {
    name: String!
    description: String
    fields: [SchemaFieldInput!]!
    isRequired: Boolean
    appliesTo: [String]
  }

  # Update metadata schema input
  input UpdateMetadataSchemaInput {
    name: String
    description: String
    fields: [SchemaFieldInput]
    isRequired: Boolean
    appliesTo: [String]
  }

  # Create/update metadata input
  input UpsertMetadataInput {
    assetId: ID!
    schemaId: ID!
    data: JSON!
  }

  # Extend the Query type
  extend type Query {
    # Get metadata schema by ID
    metadataSchema(id: ID!): MetadataSchemaResponse

    # Get all metadata schemas for current tenant
    metadataSchemas(pagination: PaginationInput, sort: SortInput): MetadataSchemasResponse

    # Get metadata for an asset
    assetMetadata(assetId: ID!): [Metadata]

    # Get metadata by ID
    metadata(id: ID!): MetadataResponse
  }

  # Extend the Mutation type
  extend type Mutation {
    # Create a new metadata schema
    createMetadataSchema(input: CreateMetadataSchemaInput!): MetadataSchemaResponse

    # Update metadata schema
    updateMetadataSchema(id: ID!, input: UpdateMetadataSchemaInput!): MetadataSchemaResponse

    # Delete metadata schema
    deleteMetadataSchema(id: ID!): MetadataSchemaResponse

    # Create or update metadata for an asset
    upsertMetadata(input: UpsertMetadataInput!): MetadataResponse

    # Delete metadata
    deleteMetadata(id: ID!): MetadataResponse

    # Extract metadata from asset (e.g., EXIF data from images)
    extractMetadata(assetId: ID!): MetadatasResponse
  }
`;

module.exports = metadataSchema; 