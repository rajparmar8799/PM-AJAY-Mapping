# PM-AJAY Portal - Database Version

A comprehensive government portal for PM-AJAY (Pradhan Mantri Adarsh Jal Yojana) project management with **SQLite Database Backend**.

## 🎯 Features

### ✅ Fully Functional Database Backend
- **SQLite Database** with complete schema
- **Express.js API Server** with authentication
- **Real-time data persistence** for all operations
- **Role-based access control** with JWT tokens

### ✅ Complete User Roles & Dashboards

#### 🏛️ Central Ministry
- Project fund approvals
- Agency management
- National-level analytics
- Policy oversight

#### 🏢 State Admin  
- State project proposals submission
- Project monitoring
- State-level analytics
- Regional coordination

#### 🏘️ Village Committee
- Village needs assessment
- Project feedback submission
- Local project monitoring
- Community engagement

#### 🏗️ Implementing Agency
- **Fully Enhanced Progress Updates**
  - Quick status updates
  - Detailed progress forms with milestones
  - File uploads (photos, reports, documents)
  - Issue tracking and next steps
  - Progress history timeline
- Forum discussions
- Project execution tracking

### ✅ Core Functionalities

1. **Authentication** - Secure JWT-based login
2. **Project Management** - Complete CRUD operations
3. **Progress Tracking** - Detailed progress updates with history
4. **Fund Approval** - Ministry approval workflows
5. **Needs Assessment** - Village requirement submissions
6. **Feedback System** - Community feedback collection
7. **Discussion Forum** - Inter-agency communication
8. **Proposal System** - State proposal submissions
9. **File Upload** - Document and photo attachments
10. **Real-time Analytics** - Dashboard summaries

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation & Setup

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd pm-ajay-portal
   npm install
   ```

2. **Start the Complete System**
   ```bash
   # Option 1: Use the convenient startup script
   start-full.bat

   # Option 2: Manual startup
   npm start
   ```

   This will:
   - Initialize SQLite database (if not exists)
   - Start backend API server on http://localhost:5000
   - Start frontend React app on http://localhost:3000

3. **Access the Portal**
   - Open http://localhost:3000
   - Click any role card to login instantly

## 🔐 Login Credentials

All users use password: **`demo123`**

| Role | Username | Description |
|------|----------|-------------|
| Central Ministry | `ministry_admin` | Policy & fund management |
| Maharashtra State | `maharashtra_admin` | State-level coordination |
| Haryana State | `haryana_admin` | State-level coordination |
| Village Committee 1 | `village_head1` | Thane Rural, Maharashtra |
| Village Committee 2 | `village_head2` | Ramgarh, Haryana |
| Infrastructure Agency | `infra_agency1` | Bharat Infrastructure Pvt Ltd |
| Skill Development | `skill_agency1` | Skill Development Institute |
| Construction Agency | `construction_agency1` | National Construction Corp |

## 🗄️ Database Schema

The system uses **SQLite** with the following tables:

### Core Tables
- `users` - User accounts and profiles
- `projects` - Project information and status
- `agencies` - Implementing agency details
- `milestones` - Project milestone tracking

### Activity Tables  
- `progress_history` - Detailed progress tracking
- `proposals` - State project proposals
- `needs_assessment` - Village needs submissions
- `feedback` - Community feedback
- `forum_messages` - Discussion forum posts

## 🛠️ API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Dashboard
- `GET /api/dashboard/summary` - Role-based summary

### Projects
- `GET /api/projects` - Get projects by role
- `PUT /api/projects/:id/status` - Quick status update
- `PUT /api/projects/:id/progress` - Detailed progress update
- `POST /api/projects/:id/approve-funds` - Approve funds

### Progress Tracking
- `GET /api/progress/history` - Progress history
- File uploads supported for progress updates

### Other Features
- `GET/POST /api/forum/messages` - Forum messages
- `GET/POST /api/state/proposals` - Proposals
- `POST /api/village/needs` - Needs assessment
- `POST /api/village/feedback` - Feedback submission

## 📁 Project Structure

```
pm-ajay-portal/
├── backend/
│   ├── server.js              # Express API server
│   ├── database/              # SQLite database
│   ├── scripts/
│   │   └── initDatabase.js    # Database initialization
│   ├── uploads/               # File upload storage
│   └── package.json           # Backend dependencies
├── frontend/
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── LoginPage.js
│   │   │   ├── CentralMinistryDashboard.js
│   │   │   ├── StateAdminDashboard.js
│   │   │   ├── VillageCommitteeDashboard.js
│   │   │   └── ImplementingAgencyDashboard.js
│   │   └── services/
│   │       └── api.js         # API service
│   └── package.json           # Frontend dependencies
├── start-full.bat             # Complete system startup
└── package.json               # Root dependencies
```

## 🎯 Enhanced Implementing Agency Features

The Implementing Agency dashboard now includes:

### 📊 Progress Update System
- **Quick Updates**: Slider-based progress and dropdown status
- **Detailed Updates**: Comprehensive modal with:
  - Progress percentage with visual indicator
  - Status selection
  - Current milestone tracking
  - Detailed notes and achievements
  - Issues and challenges reporting
  - Next steps planning
  - Expected completion date
  - File uploads (photos, reports, docs)

### 📈 Progress History Timeline
- Visual timeline of all progress updates
- Detailed history with notes, issues, and milestones
- Project-wise filtering for agencies

### 💬 Discussion Forum
- Project-specific or general discussions
- Real-time message posting
- Agency communication hub

## 🔧 Development

### Backend Development
```bash
cd backend
npm run dev          # Start with nodemon for auto-restart
npm run init-db      # Reinitialize database
```

### Frontend Development
```bash
cd frontend
npm start           # Start React dev server
```

### Database Management
```bash
cd backend
npm run init-db     # Reset and reinitialize database
```

## 🧪 Testing Features

### Test All Key Features:

1. **Login**: Try all 8 user roles
2. **Central Ministry**: 
   - View all projects
   - Approve project funds
   - Manage agencies
3. **State Admin**:
   - Submit new project proposals
   - View state-specific projects
4. **Village Committee**:
   - Submit needs assessments
   - Provide project feedback
5. **Implementing Agency**:
   - Quick progress updates
   - Detailed progress forms with file uploads
   - Post forum messages
   - View progress history timeline

## 🚨 Troubleshooting

### Common Issues:

1. **Database not found**
   - Run `npm run init-db` in backend directory

2. **API connection error**
   - Ensure backend is running on port 5000
   - Check if backend dependencies are installed

3. **Login failed**
   - Verify backend server is running
   - Check network console for API errors

4. **File upload not working**
   - Ensure backend/uploads directory exists
   - Check file size limits

## 📝 Notes

- All user passwords are `demo123`
- Database file: `backend/database/pm_ajay_portal.db`
- File uploads stored in: `backend/uploads/`
- JWT tokens expire in 8 hours
- Progress history maintains last 100 entries per project

## 🎉 Success!

Your PM-AJAY Portal is now running with:
- ✅ Complete SQLite database backend
- ✅ Real API authentication
- ✅ Full CRUD operations
- ✅ File upload support
- ✅ Progress tracking system
- ✅ All features fully functional

Access the portal at http://localhost:3000 and test all the features!

---
*PM-AJAY Portal - Database Version - Ready for Production Use*