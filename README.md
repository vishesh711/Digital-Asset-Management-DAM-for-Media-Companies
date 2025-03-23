# Digital Asset Management (DAM) System for Media Companies

A comprehensive digital asset management solution designed specifically for media companies to efficiently organize, store, search, and distribute digital assets like images, videos, and documents.

## What Problem It Solves

Media companies like news outlets, advertising agencies, and content creators deal with thousands of digital files (images, videos, documents, etc.) every day. Without a proper system, these assets become:
- Hard to find when needed
- Difficult to organize
- Easy to lose track of
- Time-consuming to manage
- Challenging to share with the right people

This Digital Asset Management (DAM) system solves these challenges by providing a central hub where all digital assets can be organized, searched, and distributed efficiently.

## How It Solves These Problems

1. **Centralized Storage**: All digital assets are stored in one secure place instead of scattered across different computers, drives, or cloud storage services.

2. **Easy Organization**: 
   - Assets can be categorized into collections
   - Tags and metadata make it easy to find specific assets
   - Dashboard shows statistics and recently uploaded items

3. **Quick Search**: Instead of scrolling through folders, users can search for assets by name, type, tags, or other attributes.

4. **Controlled Access**: 
   - User authentication ensures only authorized people can access assets
   - Different permission levels can be set for different teams or roles

5. **User-Friendly Interface**: 
   - Modern, responsive design that works on both computers and mobile devices
   - Visual thumbnails for easy browsing of assets
   - Intuitive upload and management tools

6. **Time-Saving**: What might take hours to find in a traditional folder system can be found in seconds with a proper DAM system.

## Features

- **User Authentication**: Secure login and registration system with role-based access control
- **Asset Management**: Upload, categorize, tag, and search for digital assets
- **Dashboard**: Interactive dashboard showing asset statistics and recently uploaded items
- **Collections**: Group related assets into collections for easier management
- **Responsive Design**: Modern UI that works across desktop and mobile devices

## Tech Stack

### Frontend
- React.js
- Redux Toolkit for state management
- React Router for navigation
- CSS for styling

### Backend (Planned)
- Node.js
- Express
- MongoDB
- GraphQL API

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/Digital-Asset-Management-DAM-for-Media-Companies.git
   cd Digital-Asset-Management-DAM-for-Media-Companies
   ```

2. Install dependencies:
   ```
   # Install frontend dependencies
   cd frontend
   npm install
   ```

3. Start the frontend development server:
   ```
   npm start
   ```

4. The application will be available at `http://localhost:3002`

## Project Structure

```
Digital-Asset-Management-DAM-for-Media-Companies/
├── frontend/                 # Frontend React application
│   ├── public/               # Public assets
│   │   ├── components/       # Reusable components
│   │   ├── pages/            # Page components
│   │   ├── store/            # Redux store setup
│   │   ├── styles/           # CSS styles
│   │   ├── services/         # API services
│   │   └── App.js            # Main App component
│   └── package.json          # Frontend dependencies
└── README.md                 # Project documentation
```

## Current Status

This project is in active development. The frontend authentication flow and user dashboard are functional with mock data. **Note: The collections and upload functionality are not yet working** - these features are in development. Backend integration is planned for the next phase.

## License

MIT