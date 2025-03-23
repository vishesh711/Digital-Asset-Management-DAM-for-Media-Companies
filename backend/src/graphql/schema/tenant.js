const { gql } = require('apollo-server-express');

const tenantSchema = gql`
  # Tenant type
  type Tenant {
    id: ID!
    name: String!
    domains: [String]
    settings: JSON
    createdAt: DateTime!
    isActive: Boolean!
    brands: [Brand]
  }

  # Brand type
  type Brand {
    id: ID!
    tenantId: ID!
    name: String!
    logoUrl: String
    settings: JSON
    createdAt: DateTime!
    isActive: Boolean!
  }

  # Tenant response
  type TenantResponse implements Response {
    success: Boolean!
    message: String
    tenant: Tenant
  }

  # Multiple tenants response
  type TenantsResponse implements Response {
    success: Boolean!
    message: String
    tenants: [Tenant]
    totalCount: Int
  }

  # Brand response
  type BrandResponse implements Response {
    success: Boolean!
    message: String
    brand: Brand
  }

  # Multiple brands response
  type BrandsResponse implements Response {
    success: Boolean!
    message: String
    brands: [Brand]
    totalCount: Int
  }

  # Input for creating a tenant
  input CreateTenantInput {
    name: String!
    domains: [String]
    settings: JSON
  }

  # Input for updating a tenant
  input UpdateTenantInput {
    name: String
    domains: [String]
    settings: JSON
    isActive: Boolean
  }

  # Input for creating a brand
  input CreateBrandInput {
    name: String!
    logoUrl: String
    settings: JSON
  }

  # Input for updating a brand
  input UpdateBrandInput {
    name: String
    logoUrl: String
    settings: JSON
    isActive: Boolean
  }

  # Extend the Query type
  extend type Query {
    # Get current tenant
    currentTenant: Tenant

    # Get tenant by ID (admin only)
    tenant(id: ID!): TenantResponse

    # Get all tenants (admin only)
    tenants(pagination: PaginationInput, sort: SortInput): TenantsResponse

    # Get brand by ID
    brand(id: ID!): BrandResponse

    # Get all brands for current tenant
    brands(pagination: PaginationInput, sort: SortInput): BrandsResponse
  }

  # Extend the Mutation type
  extend type Mutation {
    # Create a new tenant (admin only)
    createTenant(input: CreateTenantInput!): TenantResponse

    # Update tenant (admin only)
    updateTenant(id: ID!, input: UpdateTenantInput!): TenantResponse

    # Delete tenant (admin only)
    deleteTenant(id: ID!): TenantResponse

    # Create a new brand
    createBrand(input: CreateBrandInput!): BrandResponse

    # Update brand
    updateBrand(id: ID!, input: UpdateBrandInput!): BrandResponse

    # Delete brand
    deleteBrand(id: ID!): BrandResponse
  }
`;

module.exports = tenantSchema; 