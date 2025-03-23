# Digital Asset Management (DAM) System for Media Companies

A comprehensive digital asset management solution designed specifically for media companies to efficiently organize, store, search, and distribute digital assets like images, videos, and documents.

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

This project is in active development. The frontend authentication flow and user dashboard are functional with mock data. Backend integration is planned for the next phase.

## License

MIT