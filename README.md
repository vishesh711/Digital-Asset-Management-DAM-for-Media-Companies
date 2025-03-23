# Digital Asset Management (DAM) System for Media Companies

A digital asset management solution designed for media companies to organize, store, search, and distribute digital assets like images, videos, and documents.

## Project Status - IMPORTANT

**This project is currently in early development with several limitations:**

- The application is primarily a frontend prototype with limited functionality
- Many features are simulated with mock data and are not fully functional
- Backend integration is incomplete
- Collections and upload functionality are not working
- Image loading may have issues depending on your environment

## What Problem It Solves

Media companies like news outlets, advertising agencies, and content creators deal with thousands of digital files (images, videos, documents, etc.) every day. Without a proper system, these assets become:
- Hard to find when needed
- Difficult to organize
- Easy to lose track of
- Time-consuming to manage
- Challenging to share with the right people

This Digital Asset Management (DAM) system aims to solve these challenges by providing a central hub where all digital assets can be organized, searched, and distributed efficiently.

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
- **Asset Management**: Upload, categorize, tag, and search for digital assets (currently with limitations)
- **Dashboard**: Interactive dashboard showing asset statistics and recently uploaded items (currently using mock data)
- **Collections**: Group related assets into collections for easier management (feature not yet functional)
- **Responsive Design**: Modern UI that works across desktop and mobile devices

## Tech Stack

### Frontend
- React.js
- Redux Toolkit for state management
- React Router for navigation
- CSS for styling

### Backend (Partially Implemented)
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
   # Make sure you're in the project root directory
   
   # Install frontend dependencies
   cd frontend
   npm install
   
   # Install backend dependencies
   cd ../backend
   npm install
   
   # Return to project root
   cd ..
   ```

## Running the Project

### Quick Start (Both Frontend and Backend)

The easiest way to run the entire project is to use the included run script, which will start both the frontend and backend servers simultaneously:

1. Make sure you're in the project root directory
2. Make the run script executable (only needed once):
   ```
   chmod +x ./run
   ```
3. Start both servers:
   ```
   ./run
   ```
4. The application will be available at:
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:4000`
5. To stop both servers, press `Ctrl+C` in the terminal

### Starting Components Separately

If you prefer to run the components individually, or if you need to troubleshoot issues:

#### Frontend Only
```
cd frontend
npm start
```
The frontend will be available at `http://localhost:3000`

#### Backend Only
```
cd backend
npm run dev
```
The backend API will be available at `http://localhost:4000`

### What Each Component Does

- **Frontend (port 3000)**: The user interface of the application where users can browse assets, view the dashboard, and interact with the system. Currently uses mock data for demonstration.

- **Backend (port 4000)**: The API server that handles data persistence, authentication, and business logic. Currently partially implemented with basic endpoints.

### Troubleshooting

If you encounter issues starting the application:

1. **Port conflicts**: Make sure ports 3000 and 4000 are not being used by other applications
   ```
   # Check if ports are in use (macOS/Linux)
   lsof -i:3000
   lsof -i:4000
   
   # Kill processes using those ports if necessary
   kill -9 <PID>
   ```

2. **Dependencies issues**: If you encounter errors related to missing modules, try reinstalling dependencies
   ```
   # For frontend
   cd frontend
   rm -rf node_modules
   npm install
   
   # For backend
   cd ../backend
   rm -rf node_modules
   npm install
   ```

3. **Script permissions**: If the run script doesn't execute, make sure it has the correct permissions
   ```
   chmod +x ./run
   ```

## Known Issues

- Image loading may fail in some environments
- Collections feature is not yet implemented
- Upload functionality is not working
- Backend integration is incomplete
- Most functionality relies on mock data rather than a real database

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
├── backend/                  # Backend application (partially implemented)
│   ├── src/                  # Source code
│   │   ├── controllers/      # Request handlers
│   │   ├── models/           # Data models
│   │   ├── routes/           # API routes
│   │   └── index.js          # Main entry point
│   └── package.json          # Backend dependencies
├── run                       # Script to run both frontend and backend
└── README.md                 # Project documentation
```

## License

MIT