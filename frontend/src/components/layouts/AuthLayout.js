import React from 'react';
import { Outlet } from 'react-router-dom';
import '../../styles/auth.css';

const AuthLayout = () => {
  return (
    <div className="auth-layout">
      <div className="auth-container">
        <div className="auth-logo">
          <h1>Digital Asset Management</h1>
        </div>
        
        <div className="auth-content">
          <Outlet />
        </div>
        
        <div className="auth-footer">
          <p>&copy; {new Date().getFullYear()} Digital Asset Management</p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout; 