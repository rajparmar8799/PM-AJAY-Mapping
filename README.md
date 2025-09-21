# PM-AJAY Portal

**Pradhan Mantri - Adarsh Jal Yojana Portal**  
*Government of India*

A comprehensive full-stack government-style web application for managing PM-AJAY projects with role-based authentication and dashboards.

## 🚀 Features

### 🔐 Four Login Roles
1. **Central Ministry** - Policy management & fund allocation oversight
2. **State Admin** - State-level project coordination & management  
3. **Village Committee** - Village-level development & monitoring
4. **Implementing Agency** - Project execution & progress updates

### 📊 Role-based Dashboards
- **Executive summaries** with auto-generated statistics
- **Interactive project management** with real-time updates
- **Budget tracking** and fund utilization monitoring
- **Progress visualization** with dynamic charts

### 🗣️ Special Features
- **Discussion Forum** for implementing agencies
- **Village needs assessment** submission system
- **Project proposal** management workflow
- **Real-time progress updates** with milestone tracking
- **Advanced Search & Filter** functionality
- **Digital Repository** for agency profiles
- **Fund Flow Tracker** with visualization
- **Public Dashboard** for transparency
- **Interactive Landing Page** with PM-AJAY overview

### 🎨 Government-style Design
- Official Indian government website styling
- Responsive design for all devices
- Clean, formal, and professional UI
- Government color scheme (blue, white, beige)

## 🛠️ Tech Stack

- **Frontend**: React 18, React Router, Axios, Tailwind CSS
- **Backend**: Node.js, Express.js, JWT Authentication, PostgreSQL
- **Styling**: CSS3 with government design system
- **Database**: PostgreSQL with connection pooling
- **Containerization**: Docker & Docker Compose
- **Icons**: Emoji-based iconography

## 📁 Project Structure

```
pm-ajay-portal/
├── backend/
│   ├── server.js              # Express server with PostgreSQL
│   ├── scripts/
│   │   └── initDatabase.js    # Database initialization
│   ├── Dockerfile             # Backend container config
│   ├── .dockerignore          # Docker ignore file
│   ├── .env.example           # Environment variables template
│   └── package.json           # Backend dependencies
├── frontend/
│   ├── public/
│   │   ├── index.html         # Main HTML template
│   │   └── manifest.json      # PWA manifest
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── LandingPage.js # PM-AJAY overview page
│   │   │   ├── PublicDashboard.js # Public transparency view
│   │   │   ├── LoginPage.js   # Login with role selection
│   │   │   ├── Navbar.js      # Government-style navigation
│   │   │   ├── CentralMinistryDashboard.js
│   │   │   ├── StateAdminDashboard.js
│   │   │   ├── VillageCommitteeDashboard.js
│   │   │   ├── ImplementingAgencyDashboard.js
│   │   │   ├── Dashboard.css  # Main dashboard styles
│   │   │   ├── LandingPage.css # Landing page styles
│   │   │   ├── LoginPage.css  # Login page styles
│   │   │   └── Navbar.css     # Navigation styles
│   │   ├── App.js             # Main app component
│   │   ├── App.css            # Global styles
│   │   └── index.js           # React entry point
│   ├── Dockerfile             # Frontend container config
│   ├── nginx.conf             # Nginx configuration
│   ├── .dockerignore          # Docker ignore file
│   └── package.json           # Frontend dependencies
├── docker-compose.yml         # Multi-service orchestration
├── docker-setup.sh           # Docker setup script
├── package.json              # Root package with concurrent scripts
└── README.md                 # This file
```

## 🚀 Quick Start

### Option 1: Docker Deployment (Recommended)

#### Prerequisites
- Docker (version 20.10 or higher)
- Docker Compose (version 2.0 or higher)

#### Quick Docker Setup

1. **Clone or extract the project**
   ```bash
   cd pm-ajay-portal
   ```

2. **Run the Docker setup script**
   ```bash
   ./docker-setup.sh
   ```
   Or manually:
   ```bash
   docker-compose up --build -d
   ```

3. **Access the application**
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:5000
   - **Database**: localhost:5432

### Option 2: Local Development

#### Prerequisites
- Node.js (version 18 or higher)
- npm (comes with Node.js)
- PostgreSQL (version 15 or higher)

#### Manual Setup

1. **Clone or extract the project**
   ```bash
   cd pm-ajay-portal
   ```

2. **Set up PostgreSQL database**
   ```bash
   createdb pm_ajay_portal
   ```

3. **Configure environment variables**
   ```bash
   cp backend/.env.example backend/.env
   # Edit backend/.env with your database credentials
   ```

4. **Install dependencies and initialize database**
   ```bash
   npm run install-all
   cd backend && npm run init-db
   ```

5. **Start the application**
   ```bash
   npm start
   ```

6. **Access the application**
   - Open your browser and go to: `http://localhost:3000`
   - The backend API will be running at: `http://localhost:5000`

## 🔑 Sample Login Credentials

**All users use password: `demo123`**

### Central Ministry
- **Username**: `ministry_admin` | **Role**: Central Ministry Administrator

### State Admin
- **Username**: `maharashtra_admin` | **Role**: Maharashtra State Administrator
- **Username**: `haryana_admin` | **Role**: Haryana State Administrator

### Village Committee
- **Username**: `village_head1` | **Role**: Village Committee Head - Thane Rural
- **Username**: `village_head2` | **Role**: Village Committee Head - Ramgarh

### Implementing Agency
- **Username**: `infra_agency1` | **Role**: Bharat Infrastructure Pvt Ltd
- **Username**: `skill_agency1` | **Role**: Skill Development Institute
- **Username**: `construction_agency1` | **Role**: National Construction Corp

### Public Viewer
- **Username**: `public_viewer` | **Role**: Public Viewer (No password required for public access)

## 📋 Features by Role

### 🏛️ Central Ministry Dashboard
- **Executive Overview**: Total projects, budget utilization, active agencies
- **Project Management**: View all projects across states with approval capabilities
- **Agency Management**: Monitor implementing agencies performance
- **Fund Allocation**: Approve project funding requests

### 🏢 State Admin Dashboard  
- **State Summary**: State-level project statistics and progress
- **District Analysis**: District-wise project distribution and status
- **Project Proposals**: Submit new project proposals to Central Ministry
- **Coordination**: Manage state-level project implementation

### 🏘️ Village Committee Dashboard
- **Village Projects**: Detailed view of village-specific development projects
- **Needs Assessment**: Submit village development requirements
- **Feedback System**: Provide feedback on ongoing projects
- **Community Monitoring**: Track project benefits and community impact

### 🏗️ Implementing Agency Dashboard
- **Project Portfolio**: View assigned projects with detailed information
- **Progress Updates**: Real-time project progress tracking with slider controls
- **Discussion Forum**: Communicate with other agencies, share updates, ask questions
- **Status Management**: Update project status and milestone completion

## 🌟 Key Functionalities

### Authentication & Security
- JWT token-based authentication
- Role-based access control
- Secure API endpoints
- Session management

### Dashboard Features
- **Auto-generated summaries** with key metrics
- **Interactive progress bars** with color coding
- **Real-time data updates** through API calls
- **Responsive design** for mobile and desktop

### Forum System (Implementing Agencies)
- Post project updates and queries
- Project-specific or general discussions  
- Real-time message display
- Agency collaboration platform

### Data Management
- **Mock database** using JSON files
- **Sample data** for realistic demonstration
- **CRUD operations** for projects and users
- **Data persistence** across sessions

## 🎨 Design System

### Color Scheme
- **Primary Blue**: #1976d2 (Government blue)
- **Navy**: #0d47a1 (Dark accent)
- **Orange**: #ff9800 (Secondary accent)
- **Success Green**: #4caf50
- **Warning Amber**: #ffc107
- **Error Red**: #f44336

### Typography
- **Primary Font**: Inter (modern, clean)
- **Secondary Font**: Roboto (government standard)
- **Formal styling** with proper hierarchy

### Components
- **Cards** with subtle shadows and hover effects
- **Progress bars** with gradient fills
- **Badges** for status indicators  
- **Tables** with sticky headers
- **Forms** with validation styling

## 🔧 Development

### Backend API Endpoints
```
POST /api/auth/login                 - User authentication
GET  /api/auth/profile              - Get user profile
GET  /api/dashboard/summary         - Dashboard statistics
GET  /api/projects                  - Get projects by role
PUT  /api/projects/:id/status       - Update project status
GET  /api/agencies                  - Get implementing agencies
GET  /api/forum/messages            - Get forum messages
POST /api/forum/messages            - Post forum message
POST /api/projects/:id/approve-funds - Approve project funds
POST /api/village/needs             - Submit village needs
```

### File Structure Details
- **Component-based architecture** for maintainability
- **Separate CSS files** for each component
- **Modular styling** with CSS custom properties
- **Responsive breakpoints** for mobile-first design

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Kill processes on ports 3000 and 5000
   npx kill-port 3000 5000
   npm start
   ```

2. **Dependencies not installed**
   ```bash
   # Clean install
   rm -rf node_modules package-lock.json
   rm -rf backend/node_modules backend/package-lock.json  
   rm -rf frontend/node_modules frontend/package-lock.json
   npm run install-all
   ```

3. **API connection issues**
   - Check if backend is running on port 5000
   - Verify proxy configuration in frontend package.json
   - Check browser console for CORS errors

### Development Tips
- Use browser developer tools to inspect API calls
- Check backend console for server logs
- Frontend proxy automatically handles API routing
- Sample data is pre-populated for immediate testing

## 🚀 Deployment

### Docker Deployment (Recommended)

1. **Build and run with Docker Compose**
   ```bash
   # Build and start all services
   docker-compose up --build -d

   # Or use the setup script
   ./docker-setup.sh
   ```

2. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Database: localhost:5432

3. **Docker commands**
   ```bash
   # View logs
   docker-compose logs -f

   # Stop services
   docker-compose down

   # Rebuild after changes
   docker-compose up --build --force-recreate
   ```

### Manual Deployment

1. **Build frontend for production**
   ```bash
   cd frontend
   npm run build
   ```

2. **Start backend**
   ```bash
   cd ../backend
   npm start
   ```

### Environment Variables

Create `.env` file in backend directory:
```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=pm_ajay_portal
DB_USER=postgres
DB_PASSWORD=password

# Server Configuration
PORT=5000
JWT_SECRET=pm-ajay-portal-secret-key-2024
NODE_ENV=production
```

## 📝 License

This project is created for demonstration purposes. 

**© 2024 PM-AJAY Portal - Government of India Style Demo**

---

### 🎯 Next Steps for Enhancement

1. ✅ **Database Integration**: PostgreSQL with connection pooling
2. ✅ **Advanced Search & Filter**: Implemented across all dashboards
3. ✅ **Digital Repository**: Agency profiles with performance metrics
4. ✅ **Fund Flow Tracker**: Visual fund allocation tracking
5. ✅ **Public Dashboard**: Transparency view for citizens
6. ✅ **Docker Containerization**: Complete container setup
7. 🔄 **Real-time Notifications**: WebSocket integration (pending)
8. 📱 **Mobile App**: React Native mobile application
9. 📊 **Advanced Analytics**: Enhanced data visualization
10. 📧 **Email Notifications**: Automated status updates

---

**Built with ❤️ for Government Digital India Initiative**