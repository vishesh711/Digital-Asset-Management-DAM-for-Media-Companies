import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Components we've created
import ProtectedRoute from './components/auth/ProtectedRoute';
import MainLayout from './components/layouts/MainLayout';
import AuthLayout from './components/layouts/AuthLayout';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import AssetsPage from './pages/assets/AssetsPage';

function App() {
  const { isAuthenticated } = useSelector(state => state.auth || { isAuthenticated: false });

  return (
    <Routes>
      {/* Authentication Routes */}
      <Route element={<AuthLayout />}>
        <Route 
          path="login" 
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />} 
        />
        <Route 
          path="register" 
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <RegisterPage />} 
        />
        <Route 
          path="forgot-password" 
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <ForgotPasswordPage />} 
        />
        <Route 
          path="login/register" 
          element={<Navigate to="/register" replace />} 
        />
      </Route>

      {/* Protected Routes */}
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="assets" element={<AssetsPage />} />
        {/* Add other protected routes here as children of the MainLayout route */}
      </Route>

      {/* Root Redirect */}
      <Route 
        path="/" 
        element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} 
      />

      {/* Not Found */}
      <Route path="*" element={<div>Page Not Found</div>} />
    </Routes>
  );
}

export default App; 