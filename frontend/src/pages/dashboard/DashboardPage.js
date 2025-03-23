import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import '../../styles/dashboard.css';

// Mock data for demonstration
const mockAssets = [
  {
    id: '1',
    title: 'Brand Logo 2023',
    type: 'Image',
    thumbnail: 'https://via.placeholder.com/300x200/0078d4/FFFFFF?text=Logo',
    createdAt: '2023-03-15',
    size: '2.4 MB'
  },
  {
    id: '2',
    title: 'Product Launch Video',
    type: 'Video',
    thumbnail: 'https://via.placeholder.com/300x200/FF4500/FFFFFF?text=Video',
    createdAt: '2023-03-12',
    size: '45.2 MB'
  },
  {
    id: '3',
    title: 'Q1 Marketing Report',
    type: 'Document',
    thumbnail: 'https://via.placeholder.com/300x200/4CAF50/FFFFFF?text=PDF',
    createdAt: '2023-03-10',
    size: '3.8 MB'
  },
  {
    id: '4',
    title: 'Social Media Campaign',
    type: 'Image',
    thumbnail: 'https://via.placeholder.com/300x200/9C27B0/FFFFFF?text=Campaign',
    createdAt: '2023-03-05',
    size: '1.7 MB'
  }
];

const DashboardPage = () => {
  const { user } = useSelector(state => state.auth);
  
  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h2>Welcome, {user?.name || 'User'}</h2>
        <p>Here's an overview of your digital assets.</p>
      </div>
      
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Assets</h3>
          <p className="stat-value">248</p>
          <div className="stat-trend up">
            <span>↑ 12% from last month</span>
          </div>
        </div>
        
        <div className="stat-card">
          <h3>Total Collections</h3>
          <p className="stat-value">15</p>
          <div className="stat-trend up">
            <span>↑ 3% from last month</span>
          </div>
        </div>
        
        <div className="stat-card">
          <h3>Recent Uploads</h3>
          <p className="stat-value">24</p>
          <div className="stat-trend up">
            <span>↑ 18% from last month</span>
          </div>
        </div>
        
        <div className="stat-card">
          <h3>Storage Used</h3>
          <p className="stat-value">4.2 GB</p>
          <div className="stat-trend down">
            <span>↓ 5% from last month</span>
          </div>
        </div>
      </div>
      
      <div className="dashboard-section">
        <div className="section-header">
          <h3>Recent Assets</h3>
          <Link to="/assets" className="view-all">View All</Link>
        </div>
        <div className="asset-grid">
          {mockAssets.map(asset => (
            <div className="asset-card" key={asset.id}>
              <div className="asset-thumbnail">
                <img src={asset.thumbnail} alt={asset.title} />
                <div className="asset-type">{asset.type}</div>
              </div>
              <div className="asset-info">
                <h4>{asset.title}</h4>
                <div className="asset-meta">
                  <div className="asset-date">Added: {asset.createdAt}</div>
                  <div className="asset-size">{asset.size}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="dashboard-section">
        <div className="section-header">
          <h3>Quick Actions</h3>
        </div>
        <div className="action-buttons">
          <Link to="/upload" className="action-button">
            <div className="action-icon">↑</div>
            <div className="action-label">Upload Assets</div>
          </Link>
          
          <Link to="/collections/new" className="action-button">
            <div className="action-icon">+</div>
            <div className="action-label">Create Collection</div>
          </Link>
          
          <Link to="/assets/search" className="action-button">
            <div className="action-icon">🔍</div>
            <div className="action-label">Search Assets</div>
          </Link>
          
          <Link to="/reports" className="action-button">
            <div className="action-icon">📊</div>
            <div className="action-label">View Reports</div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 