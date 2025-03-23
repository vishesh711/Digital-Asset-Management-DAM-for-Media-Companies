import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearCredentials } from '../../store/auth/authSlice';
import '../../styles/main-layout.css';

const MainLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    dispatch(clearCredentials());
    navigate('/login');
  };
  
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="main-layout">
      <header className="main-header">
        <div className="header-content">
          <div className="logo">
            <h1>Digital Asset Management</h1>
          </div>
          
          <nav className="main-nav">
            <ul>
              <li><Link to="/dashboard" className="active">Dashboard</Link></li>
              <li><Link to="/assets">Assets</Link></li>
              <li><Link to="/collections">Collections</Link></li>
              <li><Link to="/upload">Upload</Link></li>
            </ul>
          </nav>
          
          <div className="user-menu">
            <button className="user-menu-toggle" onClick={toggleMenu}>
              <span className="user-name">{user?.name || 'User'}</span>
              <span className="avatar">{user?.name?.charAt(0) || 'U'}</span>
            </button>
            
            {menuOpen && (
              <div className="user-dropdown">
                <ul>
                  <li><Link to="/profile">Profile</Link></li>
                  <li><Link to="/settings">Settings</Link></li>
                  <li><button onClick={handleLogout}>Logout</button></li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </header>
      
      <main className="main-content">
        <Outlet />
      </main>
      
      <footer className="main-footer">
        <div className="footer-content">
          <p>&copy; {new Date().getFullYear()} Digital Asset Management</p>
          <div className="footer-links">
            <Link to="/help">Help</Link>
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout; 