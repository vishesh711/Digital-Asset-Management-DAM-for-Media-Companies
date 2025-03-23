import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/assets.css';

// Mock data for demonstration
const mockAssets = [
  {
    id: '1',
    title: 'Brand Logo 2023',
    type: 'Image',
    thumbnail: '/mock-images/logo.jpg',
    createdAt: '2023-03-15',
    size: '2.4 MB',
    tags: ['logo', 'brand', 'marketing']
  },
  {
    id: '2',
    title: 'Product Launch Video',
    type: 'Video',
    thumbnail: '/mock-images/video-thumbnail.jpg',
    createdAt: '2023-03-12',
    size: '45.2 MB',
    tags: ['video', 'product', 'launch']
  },
  {
    id: '3',
    title: 'Q1 Marketing Report',
    type: 'Document',
    thumbnail: '/mock-images/document.jpg',
    createdAt: '2023-03-10',
    size: '3.8 MB',
    tags: ['report', 'marketing', 'quarterly']
  },
  {
    id: '4',
    title: 'Social Media Campaign',
    type: 'Image',
    thumbnail: '/mock-images/social-campaign.jpg',
    createdAt: '2023-03-05',
    size: '1.7 MB',
    tags: ['social', 'campaign', 'marketing']
  },
  {
    id: '5',
    title: 'Company Podcast',
    type: 'Audio',
    thumbnail: '/mock-images/podcast.jpg',
    createdAt: '2023-03-01',
    size: '28.5 MB',
    tags: ['podcast', 'audio', 'interview']
  },
  {
    id: '6',
    title: 'Mobile App Screenshots',
    type: 'Image',
    thumbnail: '/mock-images/mobile-app.jpg',
    createdAt: '2023-02-28',
    size: '3.2 MB',
    tags: ['mobile', 'app', 'screenshot']
  },
  {
    id: '7',
    title: 'Product Catalog',
    type: 'Document',
    thumbnail: '/mock-images/catalog.jpg',
    createdAt: '2023-02-25',
    size: '12.8 MB',
    tags: ['catalog', 'product', 'pdf']
  },
  {
    id: '8',
    title: 'Team Meeting Recording',
    type: 'Video',
    thumbnail: '/mock-images/meeting.jpg',
    createdAt: '2023-02-20',
    size: '124.5 MB',
    tags: ['meeting', 'video', 'team']
  }
];

const filterOptions = {
  types: ['All Types', 'Image', 'Video', 'Document', 'Audio'],
  dateRange: ['All Time', 'Today', 'Last Week', 'Last Month', 'Last 3 Months']
};

const AssetsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedDateRange, setSelectedDateRange] = useState('All Time');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  
  // Filter assets based on search and filters
  const filteredAssets = mockAssets.filter(asset => {
    const matchesSearch = asset.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          asset.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = selectedType === 'All Types' || asset.type === selectedType;
    
    // In a real app, would filter by actual date logic
    const matchesDate = true;
    
    return matchesSearch && matchesType && matchesDate;
  });
  
  return (
    <div className="assets-page">
      <div className="assets-header">
        <h2>Digital Assets</h2>
        <Link to="/upload" className="upload-button">Upload New Asset</Link>
      </div>
      
      <div className="assets-toolbar">
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Search assets by name or tag..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-controls">
          <select 
            value={selectedType} 
            onChange={(e) => setSelectedType(e.target.value)}
          >
            {filterOptions.types.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          
          <select 
            value={selectedDateRange} 
            onChange={(e) => setSelectedDateRange(e.target.value)}
          >
            {filterOptions.dateRange.map(range => (
              <option key={range} value={range}>{range}</option>
            ))}
          </select>
        </div>
        
        <div className="view-controls">
          <button 
            className={viewMode === 'grid' ? 'active' : ''} 
            onClick={() => setViewMode('grid')}
          >
            Grid
          </button>
          <button 
            className={viewMode === 'list' ? 'active' : ''} 
            onClick={() => setViewMode('list')}
          >
            List
          </button>
        </div>
      </div>
      
      <div className={`assets-container ${viewMode}`}>
        {filteredAssets.length > 0 ? (
          filteredAssets.map(asset => (
            <div className="asset-card" key={asset.id}>
              <div className="asset-thumbnail">
                <img 
                  src={asset.thumbnail} 
                  alt={asset.title}
                  onError={(e) => {
                    // Set a colored background based on asset type
                    let bgColor = '#0078d4'; // Default blue
                    if (asset.type === 'Video') bgColor = '#FF4500';
                    if (asset.type === 'Document') bgColor = '#4CAF50';
                    if (asset.type === 'Audio') bgColor = '#FFC107';
                    
                    e.target.onerror = null; // Prevent infinite loop
                    e.target.src = `https://via.placeholder.com/300x200/${bgColor.substring(1)}/FFFFFF?text=${asset.type}`;
                  }}
                />
                <div className="asset-type">{asset.type}</div>
              </div>
              <div className="asset-info">
                <h4>{asset.title}</h4>
                <div className="asset-meta">
                  <div className="asset-date">Added: {asset.createdAt}</div>
                  <div className="asset-size">{asset.size}</div>
                </div>
                {viewMode === 'list' && (
                  <div className="asset-tags">
                    {asset.tags.map(tag => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
              <div className="asset-actions">
                <button>View</button>
                <button>Download</button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">
            <p>No assets found matching your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssetsPage; 