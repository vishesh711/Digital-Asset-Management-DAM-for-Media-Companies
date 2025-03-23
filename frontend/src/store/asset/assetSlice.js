import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { gql } from '@apollo/client';
import { client } from '../../services/apollo';

// GraphQL Queries & Mutations
const GET_ASSETS = gql`
  query GetAssets($input: AssetSearchInput) {
    assets(input: $input) {
      success
      message
      assets {
        id
        title
        description
        filename
        fileType
        fileSize
        previewUrl
        downloadUrl
        tags {
          id
          name
          category
        }
        createdAt
        updatedAt
      }
      totalCount
    }
  }
`;

const GET_ASSET = gql`
  query GetAsset($id: ID!) {
    asset(id: $id) {
      success
      message
      asset {
        id
        title
        description
        filename
        fileType
        fileSize
        previewUrl
        downloadUrl
        tags {
          id
          name
          category
        }
        collections {
          id
          name
        }
        metadata
        createdAt
        updatedAt
      }
    }
  }
`;

// Async Thunks
export const fetchAssets = createAsyncThunk(
  'asset/fetchAssets',
  async (searchParams = {}, { rejectWithValue }) => {
    try {
      const { data } = await client.query({
        query: GET_ASSETS,
        variables: { input: searchParams }
      });
      
      return data.assets;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch assets');
    }
  }
);

export const fetchAssetById = createAsyncThunk(
  'asset/fetchAssetById',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await client.query({
        query: GET_ASSET,
        variables: { id }
      });
      
      return data.asset;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch asset');
    }
  }
);

// Asset Slice
const assetSlice = createSlice({
  name: 'asset',
  initialState: {
    assets: [],
    totalCount: 0,
    currentAsset: null,
    loading: false,
    loadingDetail: false,
    error: null,
    searchParams: {
      page: 1,
      limit: 20,
      sortBy: 'createdAt',
      sortDirection: 'DESC',
      query: '',
      filters: {}
    }
  },
  reducers: {
    updateSearchParams: (state, action) => {
      state.searchParams = {
        ...state.searchParams,
        ...action.payload
      };
    },
    clearErrors: (state) => {
      state.error = null;
    },
    clearCurrentAsset: (state) => {
      state.currentAsset = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchAssets reducers
      .addCase(fetchAssets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssets.fulfilled, (state, action) => {
        state.loading = false;
        state.assets = action.payload.assets || [];
        state.totalCount = action.payload.totalCount || 0;
      })
      .addCase(fetchAssets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // fetchAssetById reducers
      .addCase(fetchAssetById.pending, (state) => {
        state.loadingDetail = true;
        state.error = null;
      })
      .addCase(fetchAssetById.fulfilled, (state, action) => {
        state.loadingDetail = false;
        state.currentAsset = action.payload.asset;
      })
      .addCase(fetchAssetById.rejected, (state, action) => {
        state.loadingDetail = false;
        state.error = action.payload;
      });
  }
});

export const { updateSearchParams, clearErrors, clearCurrentAsset } = assetSlice.actions;
export default assetSlice.reducer; 