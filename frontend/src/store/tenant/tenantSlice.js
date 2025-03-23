import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { gql } from '@apollo/client';
import { client } from '../../services/apollo';

// GraphQL queries
const GET_CURRENT_TENANT = gql`
  query GetCurrentTenant {
    currentTenant {
      id
      name
      domains
      settings
      createdAt
      isActive
    }
  }
`;

const GET_TENANT_BRANDS = gql`
  query GetTenantBrands($pagination: PaginationInput, $sort: SortInput) {
    brands(pagination: $pagination, sort: $sort) {
      success
      message
      brands {
        id
        tenantId
        name
        logoUrl
        settings
        createdAt
        isActive
      }
      totalCount
    }
  }
`;

// Async thunks
export const fetchCurrentTenant = createAsyncThunk(
  'tenant/fetchCurrentTenant',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await client.query({
        query: GET_CURRENT_TENANT,
        fetchPolicy: 'network-only',
      });
      
      return data.currentTenant;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchTenantBrands = createAsyncThunk(
  'tenant/fetchTenantBrands',
  async ({ pagination, sort } = {}, { rejectWithValue }) => {
    try {
      const { data } = await client.query({
        query: GET_TENANT_BRANDS,
        variables: { pagination, sort },
        fetchPolicy: 'network-only',
      });
      
      return data.brands;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Tenant slice
const tenantSlice = createSlice({
  name: 'tenant',
  initialState: {
    current: null,
    brands: [],
    totalBrands: 0,
    selectedBrand: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    selectBrand: (state, action) => {
      state.selectedBrand = action.payload;
    },
    clearTenant: (state) => {
      state.current = null;
      state.brands = [];
      state.totalBrands = 0;
      state.selectedBrand = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch current tenant
      .addCase(fetchCurrentTenant.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCurrentTenant.fulfilled, (state, action) => {
        state.isLoading = false;
        state.current = action.payload;
      })
      .addCase(fetchCurrentTenant.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch tenant brands
      .addCase(fetchTenantBrands.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTenantBrands.fulfilled, (state, action) => {
        state.isLoading = false;
        state.brands = action.payload.brands;
        state.totalBrands = action.payload.totalCount;
        
        // Auto-select first brand if none selected
        if (!state.selectedBrand && action.payload.brands.length > 0) {
          state.selectedBrand = action.payload.brands[0];
        }
      })
      .addCase(fetchTenantBrands.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { selectBrand, clearTenant, clearError } = tenantSlice.actions;

export default tenantSlice.reducer; 