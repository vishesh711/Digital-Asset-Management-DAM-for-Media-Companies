const { gql } = require('apollo-server-express');

const distributionSchema = gql`
  # Distribution channel type
  type DistributionChannel {
    id: ID!
    tenantId: ID!
    name: String!
    type: DistributionChannelType!
    config: JSON
    isActive: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime
  }

  # Distribution channel type enum
  enum DistributionChannelType {
    WEBSITE
    SOCIAL_MEDIA
    EMAIL
    API
    CMS
    CUSTOM
  }

  # Distribution status enum
  enum DistributionStatus {
    PENDING
    IN_PROGRESS
    COMPLETE
    FAILED
    CANCELLED
  }

  # Distribution record type
  type Distribution {
    id: ID!
    tenantId: ID!
    channelId: ID!
    assetIds: [ID!]!
    collectionIds: [ID!]
    status: DistributionStatus!
    scheduledAt: DateTime
    completedAt: DateTime
    failureReason: String
    metadata: JSON
    channel: DistributionChannel
    assets: [Asset]
    collections: [Collection]
    createdBy: User
    createdAt: DateTime!
    updatedAt: DateTime
  }

  # Distribution channel response
  type DistributionChannelResponse implements Response {
    success: Boolean!
    message: String
    channel: DistributionChannel
  }

  # Multiple distribution channels response
  type DistributionChannelsResponse implements Response {
    success: Boolean!
    message: String
    channels: [DistributionChannel]
    totalCount: Int
  }

  # Distribution response
  type DistributionResponse implements Response {
    success: Boolean!
    message: String
    distribution: Distribution
  }

  # Multiple distributions response
  type DistributionsResponse implements Response {
    success: Boolean!
    message: String
    distributions: [Distribution]
    totalCount: Int
  }

  # Create distribution channel input
  input CreateDistributionChannelInput {
    name: String!
    type: DistributionChannelType!
    config: JSON
    isActive: Boolean
  }

  # Update distribution channel input
  input UpdateDistributionChannelInput {
    name: String
    type: DistributionChannelType
    config: JSON
    isActive: Boolean
  }

  # Create distribution input
  input CreateDistributionInput {
    channelId: ID!
    assetIds: [ID!]
    collectionIds: [ID!]
    scheduledAt: DateTime
    metadata: JSON
  }

  # Distribution search input
  input DistributionSearchInput {
    channelIds: [ID]
    status: [DistributionStatus]
    dateFrom: DateTime
    dateTo: DateTime
    createdBy: ID
  }

  # Extend the Query type
  extend type Query {
    # Get distribution channel by ID
    distributionChannel(id: ID!): DistributionChannelResponse

    # Get all distribution channels
    distributionChannels(
      pagination: PaginationInput, 
      sort: SortInput
    ): DistributionChannelsResponse

    # Get distribution record by ID
    distribution(id: ID!): DistributionResponse

    # Get all distribution records
    distributions(
      search: DistributionSearchInput
      pagination: PaginationInput
      sort: SortInput
    ): DistributionsResponse

    # Get distribution history for an asset
    assetDistributions(assetId: ID!): [Distribution]
  }

  # Extend the Mutation type
  extend type Mutation {
    # Create a new distribution channel
    createDistributionChannel(input: CreateDistributionChannelInput!): DistributionChannelResponse

    # Update distribution channel
    updateDistributionChannel(id: ID!, input: UpdateDistributionChannelInput!): DistributionChannelResponse

    # Delete distribution channel
    deleteDistributionChannel(id: ID!): DistributionChannelResponse

    # Create a new distribution
    createDistribution(input: CreateDistributionInput!): DistributionResponse

    # Cancel distribution
    cancelDistribution(id: ID!): DistributionResponse

    # Retry failed distribution
    retryDistribution(id: ID!): DistributionResponse
  }
`;

module.exports = distributionSchema; 