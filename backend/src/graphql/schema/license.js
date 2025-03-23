const { gql } = require('apollo-server-express');

const licenseSchema = gql`
  # License type
  type License {
    id: ID!
    tenantId: ID!
    name: String!
    description: String
    terms: String
    startDate: DateTime
    endDate: DateTime
    isActive: Boolean!
    restrictions: [String]
    territories: [String]
    usageTypes: [String]
    assets: [Asset]
    createdAt: DateTime!
    updatedAt: DateTime
  }

  # License usage type
  enum LicenseUsageType {
    INTERNAL
    EDITORIAL
    COMMERCIAL
    SOCIAL_MEDIA
    ADVERTISING
    PRINT
    DIGITAL
    BROADCAST
  }

  # License response
  type LicenseResponse implements Response {
    success: Boolean!
    message: String
    license: License
  }

  # Multiple licenses response
  type LicensesResponse implements Response {
    success: Boolean!
    message: String
    licenses: [License]
    totalCount: Int
  }

  # Create license input
  input CreateLicenseInput {
    name: String!
    description: String
    terms: String
    startDate: DateTime
    endDate: DateTime
    restrictions: [String]
    territories: [String]
    usageTypes: [String]
  }

  # Update license input
  input UpdateLicenseInput {
    name: String
    description: String
    terms: String
    startDate: DateTime
    endDate: DateTime
    isActive: Boolean
    restrictions: [String]
    territories: [String]
    usageTypes: [String]
  }

  # License search input
  input LicenseSearchInput {
    query: String
    isActive: Boolean
    startDateFrom: DateTime
    startDateTo: DateTime
    endDateFrom: DateTime
    endDateTo: DateTime
    usageTypes: [String]
  }

  # Extend the Query type
  extend type Query {
    # Get license by ID
    license(id: ID!): LicenseResponse

    # Get all licenses with filtering and pagination
    licenses(
      search: LicenseSearchInput
      pagination: PaginationInput
      sort: SortInput
    ): LicensesResponse

    # Get licenses for an asset
    assetLicenses(assetId: ID!): [License]
  }

  # Extend the Mutation type
  extend type Mutation {
    # Create a new license
    createLicense(input: CreateLicenseInput!): LicenseResponse

    # Update license
    updateLicense(id: ID!, input: UpdateLicenseInput!): LicenseResponse

    # Delete license
    deleteLicense(id: ID!): LicenseResponse

    # Associate license with assets
    associateLicenseWithAssets(licenseId: ID!, assetIds: [ID!]!): LicenseResponse

    # Remove license from assets
    removeLicenseFromAssets(licenseId: ID!, assetIds: [ID!]!): LicenseResponse
  }
`;

module.exports = licenseSchema; 