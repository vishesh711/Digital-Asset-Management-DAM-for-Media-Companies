import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { gql } from '@apollo/client';
import { client } from '../../services/apollo';

// GraphQL Queries & Mutations
const GET_COLLECTIONS = gql`
  query GetCollections($input: CollectionSearchInput) {
    collections(input: $input) {
      success
      message
      collections {
        id
        name
        description
        assetCount
        coverImageUrl
        createdAt
        updatedAt
      }
      totalCount
    }
  }
`;

const GET_COLLECTION = gql`
  query GetCollection($id: ID!) {
    collection(id: $id) {
      success
      message
      collection {
        id
        name
        description
        coverImageUrl
        isPublic
        assets {
          id
          title
          previewUrl
          fileType
        }
        createdAt
        updatedAt
      }
    }
  }
`;

// Async Thunks
export const fetchCollections = createAsyncThunk(
  'collection/fetchCollections',
  async (searchParams = {}, { rejectWithValue }) => {
    try {
      const { data } = await client.query({
        query: GET_COLLECTIONS,
        variables: { input: searchParams }
      });
      
      return data.collections;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch collections');
    }
  }
);

export const fetchCollectionById = createAsyncThunk(
  'collection/fetchCollectionById',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await client.query({
        query: GET_COLLECTION,
        variables: { id }
      });
      
      return data.collection;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch collection');
    }
  }
);

// Collection Slice
const collectionSlice = createSlice({
  name: 'collection',
  initialState: {
    collections: [],
    totalCount: 0,
    currentCollection: null,
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
    clearCurrentCollection: (state) => {
      state.currentCollection = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchCollections reducers
      .addCase(fetchCollections.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCollections.fulfilled, (state, action) => {
        state.loading = false;
        state.collections = action.payload.collections || [];
        state.totalCount = action.payload.totalCount || 0;
      })
      .addCase(fetchCollections.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // fetchCollectionById reducers
      .addCase(fetchCollectionById.pending, (state) => {
        state.loadingDetail = true;
        state.error = null;
      })
      .addCase(fetchCollectionById.fulfilled, (state, action) => {
        state.loadingDetail = false;
        state.currentCollection = action.payload.collection;
      })
      .addCase(fetchCollectionById.rejected, (state, action) => {
        state.loadingDetail = false;
        state.error = action.payload;
      });
  }
});

export const { updateSearchParams, clearErrors, clearCurrentCollection } = collectionSlice.actions;
export default collectionSlice.reducer; 