import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import tenantReducer from './tenant/tenantSlice';
import assetReducer from './asset/assetSlice';
import collectionReducer from './collection/collectionSlice';
import uiReducer from './ui/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tenant: tenantReducer,
    asset: assetReducer,
    collection: collectionReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore certain action types and paths for non-serializable data
        ignoredActions: ['asset/uploadAsset/fulfilled', 'asset/uploadAsset/pending'],
        ignoredPaths: ['asset.uploadProgress', 'asset.currentUpload'],
      },
    }),
}); 