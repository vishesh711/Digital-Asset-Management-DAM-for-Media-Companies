import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const TenantRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  const { currentTenant, loading: tenantLoading } = useSelector((state) => state.tenant);

  if (loading || tenantLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!currentTenant) {
    return <Navigate to="/select-tenant" />;
  }

  return children;
};

export default TenantRoute; 