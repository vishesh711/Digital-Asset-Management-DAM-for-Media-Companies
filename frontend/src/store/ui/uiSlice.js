import { createSlice } from '@reduxjs/toolkit';

// UI Slice
const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    // Notification state
    notification: {
      open: false,
      message: '',
      type: 'info', // 'info', 'success', 'warning', 'error'
    },
    
    // Sidebar state
    sidebar: {
      open: true,
      width: 240,
    },
    
    // Modal states
    modals: {
      uploadAsset: {
        open: false,
        uploadProgress: 0,
        uploadingFile: null,
      },
      createCollection: {
        open: false,
      },
      assetDetail: {
        open: false,
        assetId: null,
      },
      confirmDelete: {
        open: false,
        type: null, // 'asset', 'collection', etc.
        id: null,
        title: '',
      },
    },
    
    // View preferences
    preferences: {
      assetView: 'grid', // 'grid', 'list'
      gridSize: 'medium', // 'small', 'medium', 'large'
      theme: 'light', // 'light', 'dark'
      sortOrder: 'newest', // 'newest', 'oldest', 'name_asc', 'name_desc'
    },
  },
  reducers: {
    // Notification actions
    showNotification: (state, action) => {
      state.notification = {
        open: true,
        message: action.payload.message,
        type: action.payload.type || 'info',
      };
    },
    hideNotification: (state) => {
      state.notification.open = false;
    },
    
    // Sidebar actions
    toggleSidebar: (state) => {
      state.sidebar.open = !state.sidebar.open;
    },
    setSidebarWidth: (state, action) => {
      state.sidebar.width = action.payload;
    },
    
    // Modal actions
    openModal: (state, action) => {
      const { modalName, props = {} } = action.payload;
      if (state.modals[modalName]) {
        state.modals[modalName] = {
          ...state.modals[modalName],
          open: true,
          ...props,
        };
      }
    },
    closeModal: (state, action) => {
      const modalName = action.payload;
      if (state.modals[modalName]) {
        state.modals[modalName].open = false;
      }
    },
    setUploadProgress: (state, action) => {
      state.modals.uploadAsset.uploadProgress = action.payload;
    },
    setUploadingFile: (state, action) => {
      state.modals.uploadAsset.uploadingFile = action.payload;
    },
    
    // Preferences actions
    updatePreference: (state, action) => {
      const { key, value } = action.payload;
      if (state.preferences.hasOwnProperty(key)) {
        state.preferences[key] = value;
      }
    },
    setTheme: (state, action) => {
      state.preferences.theme = action.payload;
    },
  },
});

export const {
  showNotification,
  hideNotification,
  toggleSidebar,
  setSidebarWidth,
  openModal,
  closeModal,
  setUploadProgress,
  setUploadingFile,
  updatePreference,
  setTheme,
} = uiSlice.actions;

export default uiSlice.reducer; 