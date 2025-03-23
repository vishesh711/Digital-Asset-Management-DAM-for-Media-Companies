const { gql } = require('apollo-server-express');

const userSchema = gql`
  # User type
  type User {
    id: ID!
    tenantId: ID!
    email: String!
    name: String!
    avatar: String
    role: Role
    lastLogin: DateTime
    createdAt: DateTime!
    isActive: Boolean!
  }

  # Role type
  type Role {
    id: ID!
    tenantId: ID!
    name: String!
    description: String
    permissions: [Permission]
    isSystemRole: Boolean!
    createdAt: DateTime!
  }

  # Permission type
  type Permission {
    id: ID!
    name: String!
    resource: String!
    action: String!
    constraints: JSON
  }

  # API Key type
  type ApiKey {
    id: ID!
    userId: ID!
    tenantId: ID!
    name: String!
    key: String
    expiresAt: DateTime
    lastUsed: DateTime
    isActive: Boolean!
    createdAt: DateTime!
  }

  # Authentication response
  type AuthResponse implements Response {
    success: Boolean!
    message: String
    token: String
    refreshToken: String
    user: User
    tenant: Tenant
  }

  # User response
  type UserResponse implements Response {
    success: Boolean!
    message: String
    user: User
  }

  # Multiple users response
  type UsersResponse implements Response {
    success: Boolean!
    message: String
    users: [User]
    totalCount: Int
  }

  # Role response
  type RoleResponse implements Response {
    success: Boolean!
    message: String
    role: Role
  }

  # Multiple roles response
  type RolesResponse implements Response {
    success: Boolean!
    message: String
    roles: [Role]
    totalCount: Int
  }

  # API Key response
  type ApiKeyResponse implements Response {
    success: Boolean!
    message: String
    apiKey: ApiKey
  }

  # Multiple API Keys response
  type ApiKeysResponse implements Response {
    success: Boolean!
    message: String
    apiKeys: [ApiKey]
    totalCount: Int
  }

  # Login input
  input LoginInput {
    email: String!
    password: String!
  }

  # Register input
  input RegisterUserInput {
    email: String!
    password: String!
    name: String!
    roleId: ID!
  }

  # Update user input
  input UpdateUserInput {
    email: String
    name: String
    avatar: String
    roleId: ID
    isActive: Boolean
  }

  # Change password input
  input ChangePasswordInput {
    currentPassword: String!
    newPassword: String!
  }

  # Create role input
  input CreateRoleInput {
    name: String!
    description: String
    permissionIds: [ID!]!
  }

  # Update role input
  input UpdateRoleInput {
    name: String
    description: String
    permissionIds: [ID!]
  }

  # Create API Key input
  input CreateApiKeyInput {
    name: String!
    expiresAt: DateTime
  }

  # Update API Key input
  input UpdateApiKeyInput {
    name: String
    isActive: Boolean
  }

  # Extend the Query type
  extend type Query {
    # Get current user
    me: User

    # Get user by ID
    user(id: ID!): UserResponse

    # Get all users for current tenant
    users(pagination: PaginationInput, sort: SortInput): UsersResponse

    # Get role by ID
    role(id: ID!): RoleResponse

    # Get all roles for current tenant
    roles(pagination: PaginationInput, sort: SortInput): RolesResponse

    # Get all permissions
    permissions: [Permission]

    # Get API Key by ID
    apiKey(id: ID!): ApiKeyResponse

    # Get all API Keys for current user
    apiKeys(pagination: PaginationInput, sort: SortInput): ApiKeysResponse
  }

  # Extend the Mutation type
  extend type Mutation {
    # Login
    login(input: LoginInput!): AuthResponse

    # Register new user
    registerUser(input: RegisterUserInput!): AuthResponse

    # Update user
    updateUser(id: ID!, input: UpdateUserInput!): UserResponse

    # Change password
    changePassword(input: ChangePasswordInput!): UserResponse

    # Create role
    createRole(input: CreateRoleInput!): RoleResponse

    # Update role
    updateRole(id: ID!, input: UpdateRoleInput!): RoleResponse

    # Delete role
    deleteRole(id: ID!): RoleResponse

    # Create API Key
    createApiKey(input: CreateApiKeyInput!): ApiKeyResponse

    # Update API Key
    updateApiKey(id: ID!, input: UpdateApiKeyInput!): ApiKeyResponse

    # Delete API Key
    deleteApiKey(id: ID!): ApiKeyResponse

    # Refresh token
    refreshToken(refreshToken: String!): AuthResponse

    # Logout
    logout: Response
  }
`;

module.exports = userSchema; 