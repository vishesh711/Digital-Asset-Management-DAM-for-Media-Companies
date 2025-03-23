const { gql } = require('apollo-server-express');

const analyticsSchema = gql`
  # Time period enum
  enum TimePeriod {
    DAY
    WEEK
    MONTH
    QUARTER
    YEAR
    CUSTOM
  }

  # Asset usage type
  type AssetUsage {
    id: ID!
    assetId: ID!
    tenantId: ID!
    userId: ID
    channelId: ID
    usageType: String
    usageContext: String
    timestamp: DateTime!
    metadata: JSON
    asset: Asset
    user: User
    channel: DistributionChannel
  }

  # Analytics metric type
  type AnalyticsMetric {
    name: String!
    value: Float!
    unit: String
    change: Float
    period: TimePeriod
  }

  # Time series data point
  type TimeSeriesDataPoint {
    timestamp: DateTime!
    value: Float!
  }

  # Time series data
  type TimeSeriesData {
    name: String!
    unit: String
    data: [TimeSeriesDataPoint!]!
  }

  # Popular asset
  type PopularAsset {
    asset: Asset!
    usageCount: Int!
    viewCount: Int!
  }

  # Dashboard analytics
  type DashboardAnalytics {
    totalAssets: AnalyticsMetric!
    totalCollections: AnalyticsMetric!
    totalUsers: AnalyticsMetric!
    assetUsage: AnalyticsMetric!
    storage: AnalyticsMetric!
    uploadTrend: TimeSeriesData!
    usageTrend: TimeSeriesData!
    popularAssets: [PopularAsset!]!
  }

  # Asset analytics
  type AssetAnalytics {
    views: AnalyticsMetric!
    downloads: AnalyticsMetric!
    shares: AnalyticsMetric!
    distributions: AnalyticsMetric!
    viewTrend: TimeSeriesData!
    downloadTrend: TimeSeriesData!
    usageByChannel: [AnalyticsMetric!]!
    usageByType: [AnalyticsMetric!]!
  }
  
  # User analytics
  type UserAnalytics {
    activeUsers: AnalyticsMetric!
    newUsers: AnalyticsMetric!
    userActivity: TimeSeriesData!
    topUsers: [AnalyticsMetric!]!
  }

  # Collection analytics
  type CollectionAnalytics {
    views: AnalyticsMetric!
    assetUsage: AnalyticsMetric!
    popularCollections: [AnalyticsMetric!]!
    collectionGrowth: TimeSeriesData!
  }

  # Analytics filter input
  input AnalyticsFilterInput {
    period: TimePeriod!
    startDate: DateTime
    endDate: DateTime
    brandIds: [ID]
    collectionIds: [ID]
    userIds: [ID]
    assetTypes: [String]
  }

  # Asset usage response
  type AssetUsageResponse implements Response {
    success: Boolean!
    message: String
    usage: AssetUsage
  }

  # Multiple asset usages response
  type AssetUsagesResponse implements Response {
    success: Boolean!
    message: String
    usages: [AssetUsage]
    totalCount: Int
  }

  # Extend the Query type
  extend type Query {
    # Get dashboard analytics
    dashboardAnalytics(filter: AnalyticsFilterInput!): DashboardAnalytics

    # Get asset analytics
    assetAnalytics(assetId: ID!, filter: AnalyticsFilterInput!): AssetAnalytics

    # Get user analytics
    userAnalytics(filter: AnalyticsFilterInput!): UserAnalytics

    # Get collection analytics
    collectionAnalytics(collectionId: ID, filter: AnalyticsFilterInput!): CollectionAnalytics

    # Get asset usage by ID
    assetUsage(id: ID!): AssetUsageResponse

    # Get all asset usages
    assetUsages(
      assetId: ID, 
      userId: ID,
      channelId: ID,
      pagination: PaginationInput, 
      sort: SortInput
    ): AssetUsagesResponse

    # Get asset usage statistics 
    assetUsageStats(
      assetId: ID!, 
      period: TimePeriod!, 
      startDate: DateTime, 
      endDate: DateTime
    ): [TimeSeriesDataPoint!]!
  }

  # Extend the Mutation type
  extend type Mutation {
    # Record asset usage event
    recordAssetUsage(
      assetId: ID!, 
      usageType: String!, 
      channelId: ID, 
      usageContext: String,
      metadata: JSON
    ): AssetUsageResponse

    # Generate analytics report
    generateAnalyticsReport(
      reportType: String!, 
      filter: AnalyticsFilterInput!,
      format: String
    ): Response
  }
`;

module.exports = analyticsSchema; 