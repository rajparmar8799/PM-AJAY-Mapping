require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const path = require('path');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const sqlite3 = require('sqlite3').verbose();
const { Pool } = require('pg');

// Database setup - use SQLite for local development, PostgreSQL for production
let db;
const useSQLite = process.env.NODE_ENV !== 'production' || !process.env.DB_HOST;

if (useSQLite) {
  const sqlite3 = require('sqlite3').verbose();
  const dbPath = path.join(__dirname, 'database', 'pm_ajay_portal.db');
  db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('Error connecting to SQLite database:', err.message);
      process.exit(1);
    }
    console.log('Connected to SQLite database (local development)');
  });
} else {
  const { Pool } = require('pg');
  db = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'pm_ajay_portal',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

  db.on('connect', () => {
    console.log('Connected to PostgreSQL database');
  });

  db.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
  });
}

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'pm-ajay-portal-secret-key-2024';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Database helper functions
const dbGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    if (useSQLite) {
      db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    } else {
      db.query(sql, params)
        .then(result => resolve(result.rows[0] || null))
        .catch(reject);
    }
  });
};

const dbAll = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    if (useSQLite) {
      db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    } else {
      db.query(sql, params)
        .then(result => resolve(result.rows))
        .catch(reject);
    }
  });
};

const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    if (useSQLite) {
      db.run(sql, params, function(err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, changes: this.changes });
      });
    } else {
      db.query(sql, params)
        .then(result => resolve({ id: result.rows[0]?.id || null, changes: result.rowCount }))
        .catch(reject);
    }
  });
};

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Role-based authorization middleware
const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    next();
  };
};

// ============ AUTHENTICATION ENDPOINTS ============

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
      return res.status(400).json({ message: 'Username, password, and role are required' });
    }

    const user = await dbGet('SELECT * FROM users WHERE username = ? AND role = ?', [username, role]);

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { 
        id: user.id, 
        username: user.username, 
        role: user.role,
        name: user.name,
        state: user.state,
        district: user.district,
        village: user.village
      },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      message: 'Login successful',
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get current user profile
app.get('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
    const user = await dbGet('SELECT * FROM users WHERE id = ?', [req.user.id]);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ============ DASHBOARD ENDPOINTS ============

// Dashboard summary endpoint
app.get('/api/dashboard/summary', authenticateToken, async (req, res) => {
  try {
    const userRole = req.user.role;
    const userId = req.user.id;
    const userState = req.user.state;
    const userVillage = req.user.village;
    
    let summary = {};
    
    switch(userRole) {
      case 'central_ministry':
        const totalProjects = await dbGet('SELECT COUNT(*) as count FROM projects');
        const totalBudget = await dbGet('SELECT SUM(budget_allocated) as total FROM projects');
        const totalUtilized = await dbGet('SELECT SUM(budget_utilized) as total FROM projects');
        const completedProjects = await dbGet('SELECT COUNT(*) as count FROM projects WHERE status = "Completed" OR progress_percentage >= 100');
        const activeAgencies = await dbGet('SELECT COUNT(DISTINCT implementing_agency) as count FROM projects WHERE implementing_agency IS NOT NULL');
        const avgProgress = await dbGet('SELECT AVG(progress_percentage) as avg FROM projects');
        
        summary = {
          totalProjects: totalProjects.count,
          completedProjects: completedProjects.count,
          inProgressProjects: totalProjects.count - completedProjects.count,
          totalBudgetAllocated: totalBudget.total || 0,
          totalBudgetUtilized: totalUtilized.total || 0,
          budgetUtilizationPercent: totalBudget.total ? Math.round((totalUtilized.total / totalBudget.total) * 100) : 0,
          activeAgencies: activeAgencies.count,
          averageProgress: Math.round(avgProgress.avg || 0)
        };
        break;
        
      case 'state_admin':
        const stateProjects = await dbGet('SELECT COUNT(*) as count FROM projects WHERE state = ?', [userState]);
        const stateBudget = await dbGet('SELECT SUM(budget_allocated) as total FROM projects WHERE state = ?', [userState]);
        const stateUtilized = await dbGet('SELECT SUM(budget_utilized) as total FROM projects WHERE state = ?', [userState]);
        const stateCompleted = await dbGet('SELECT COUNT(*) as count FROM projects WHERE state = ? AND (status = "Completed" OR progress_percentage >= 100)', [userState]);
        const stateAvgProgress = await dbGet('SELECT AVG(progress_percentage) as avg FROM projects WHERE state = ?', [userState]);
        
        summary = {
          stateProjects: stateProjects.count,
          completedProjects: stateCompleted.count,
          inProgressProjects: stateProjects.count - stateCompleted.count,
          budgetAllocated: stateBudget.total || 0,
          budgetUtilized: stateUtilized.total || 0,
          budgetUtilizationPercent: stateBudget.total ? Math.round((stateUtilized.total / stateBudget.total) * 100) : 0,
          averageProgress: Math.round(stateAvgProgress.avg || 0)
        };
        break;
        
      case 'village_committee':
        const villageProjects = await dbGet('SELECT COUNT(*) as count FROM projects WHERE village = ?', [userVillage]);
        const villageBudget = await dbGet('SELECT SUM(budget_allocated) as total FROM projects WHERE village = ?', [userVillage]);
        const villageCompleted = await dbGet('SELECT COUNT(*) as count FROM projects WHERE village = ? AND (status = "Completed" OR progress_percentage >= 100)', [userVillage]);
        const villageAvgProgress = await dbGet('SELECT AVG(progress_percentage) as avg FROM projects WHERE village = ?', [userVillage]);
        
        summary = {
          villageProjects: villageProjects.count,
          completedProjects: villageCompleted.count,
          inProgressProjects: villageProjects.count - villageCompleted.count,
          budgetAllocated: villageBudget.total || 0,
          averageProgress: Math.round(villageAvgProgress.avg || 0)
        };
        break;
        
      case 'implementing_agency':
        const assignedProjects = await dbGet('SELECT COUNT(*) as count FROM projects WHERE implementing_agency = ?', [userId]);
        const agencyBudget = await dbGet('SELECT SUM(budget_allocated) as total FROM projects WHERE implementing_agency = ?', [userId]);
        const agencyCompleted = await dbGet('SELECT COUNT(*) as count FROM projects WHERE implementing_agency = ? AND (status = "Completed" OR progress_percentage >= 100)', [userId]);
        const agencyAvgProgress = await dbGet('SELECT AVG(progress_percentage) as avg FROM projects WHERE implementing_agency = ?', [userId]);
        
        summary = {
          assignedProjects: assignedProjects.count,
          completedProjects: agencyCompleted.count,
          inProgressProjects: assignedProjects.count - agencyCompleted.count,
          totalBudget: agencyBudget.total || 0,
          averageProgress: Math.round(agencyAvgProgress.avg || 0)
        };
        break;
    }
    
    res.json(summary);
  } catch (error) {
    console.error('Dashboard summary error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ============ PROJECT ENDPOINTS ============

// Create new project (State Admin only)
app.post('/api/projects/create', authenticateToken, authorizeRole(['state_admin']), async (req, res) => {
  try {
    const {
      name, description, type, state, district, village,
      budget_allocated, timeline, objectives, expected_beneficiaries,
      implementation_strategy, monitoring_plan, risk_assessment, sustainability_plan,
      submitted_by
    } = req.body;

    // Validate required fields
    if (!name || !description || !type || !state || !district || !village || !budget_allocated) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Generate unique project ID
    const projectId = `PROJ_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Insert project into database
    const result = await dbRun(`
      INSERT INTO projects (
        id, name, description, type, state, district, village,
        budget_allocated, progress_percentage, status,
        start_date, expected_completion, submitted_by,
        objectives, expected_beneficiaries, implementation_strategy,
        monitoring_plan, risk_assessment, sustainability_plan,
        created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `, [
      projectId, name, description, type, state, district, village,
      budget_allocated, 0, 'Pending Approval',
      null, null, submitted_by,
      objectives, expected_beneficiaries, implementation_strategy,
      monitoring_plan, risk_assessment, sustainability_plan
    ]);

    const project = await dbGet('SELECT * FROM projects WHERE id = ?', [projectId]);

    res.status(201).json({
      message: 'Project created successfully',
      project: project
    });

  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get projects based on user role
app.get('/api/projects', authenticateToken, async (req, res) => {
  try {
    const userRole = req.user.role;
    const userId = req.user.id;
    const userState = req.user.state;
    const userVillage = req.user.village;
    let projects = [];
    
    switch(userRole) {
      case 'central_ministry':
        projects = await dbAll('SELECT p.*, u.name as agency_name FROM projects p LEFT JOIN users u ON p.implementing_agency = u.id ORDER BY p.created_at DESC');
        break;
        
      case 'state_admin':
        projects = await dbAll('SELECT p.*, u.name as agency_name FROM projects p LEFT JOIN users u ON p.implementing_agency = u.id WHERE p.state = ? ORDER BY p.created_at DESC', [userState]);
        break;
        
      case 'village_committee':
        projects = await dbAll('SELECT p.*, u.name as agency_name FROM projects p LEFT JOIN users u ON p.implementing_agency = u.id WHERE p.village = ? ORDER BY p.created_at DESC', [userVillage]);
        break;
        
      case 'implementing_agency':
        projects = await dbAll('SELECT p.*, u.name as agency_name FROM projects p LEFT JOIN users u ON p.implementing_agency = u.id WHERE p.implementing_agency = ? ORDER BY p.created_at DESC', [userId]);
        break;
    }

    // Get milestones for each project
    for (let project of projects) {
      const milestones = await dbAll('SELECT * FROM milestones WHERE project_id = ? ORDER BY id', [project.id]);
      project.milestones = milestones;
    }
    
    res.json(projects);
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update project status (quick update)
app.put('/api/projects/:projectId/status', authenticateToken, authorizeRole(['implementing_agency']), async (req, res) => {
  try {
    const { projectId } = req.params;
    const { status, progress_percentage } = req.body;
    const userId = req.user.id;
    
    // Verify project belongs to this agency
    const project = await dbGet('SELECT * FROM projects WHERE id = ? AND implementing_agency = ?', [projectId, userId]);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found or access denied' });
    }
    
    // Update project
    await dbRun('UPDATE projects SET status = ?, progress_percentage = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', 
      [status, progress_percentage, projectId]);
    
    // Add to progress history
    await dbRun(`
      INSERT INTO progress_history (project_id, progress_percentage, status, updated_by)
      VALUES (?, ?, ?, ?)
    `, [projectId, progress_percentage, status, userId]);
    
    const updatedProject = await dbGet('SELECT * FROM projects WHERE id = ?', [projectId]);
    res.json({ message: 'Project status updated successfully', project: updatedProject });
  } catch (error) {
    console.error('Update project status error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Detailed progress update
app.put('/api/projects/:projectId/progress', authenticateToken, authorizeRole(['implementing_agency']), upload.array('files'), async (req, res) => {
  try {
    const { projectId } = req.params;
    const { status, progress_percentage, milestone, notes, issues, next_steps, expected_completion } = req.body;
    const userId = req.user.id;
    const files = req.files || [];
    
    // Verify project belongs to this agency
    const project = await dbGet('SELECT * FROM projects WHERE id = ? AND implementing_agency = ?', [projectId, userId]);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found or access denied' });
    }
    
    // Update project
    const updateFields = ['updated_at = CURRENT_TIMESTAMP'];
    const updateValues = [];
    
    if (status) {
      updateFields.push('status = ?');
      updateValues.push(status);
    }
    if (progress_percentage !== undefined) {
      updateFields.push('progress_percentage = ?');
      updateValues.push(parseInt(progress_percentage));
    }
    if (expected_completion) {
      updateFields.push('expected_completion = ?');
      updateValues.push(expected_completion);
    }
    
    updateValues.push(projectId);
    
    await dbRun(`UPDATE projects SET ${updateFields.join(', ')} WHERE id = ?`, updateValues);
    
    // Add detailed progress history
    await dbRun(`
      INSERT INTO progress_history 
      (project_id, progress_percentage, status, milestone, notes, issues, next_steps, files_count, updated_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [projectId, parseInt(progress_percentage), status, milestone, notes, issues, next_steps, files.length, userId]);
    
    const updatedProject = await dbGet('SELECT * FROM projects WHERE id = ?', [projectId]);
    res.json({ message: 'Progress updated successfully', project: updatedProject });
  } catch (error) {
    console.error('Update project progress error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get progress history
app.get('/api/progress/history', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    let history = [];
    
    if (userRole === 'implementing_agency') {
      history = await dbAll(`
        SELECT ph.*, p.name as project_name 
        FROM progress_history ph 
        JOIN projects p ON ph.project_id = p.id 
        WHERE p.implementing_agency = ? 
        ORDER BY ph.update_date DESC
      `, [userId]);
    } else {
      history = await dbAll(`
        SELECT ph.*, p.name as project_name 
        FROM progress_history ph 
        JOIN projects p ON ph.project_id = p.id 
        ORDER BY ph.update_date DESC
      `);
    }
    
    res.json(history);
  } catch (error) {
    console.error('Get progress history error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Approve funds (Central Ministry only)
app.post('/api/projects/:projectId/approve-funds', authenticateToken, authorizeRole(['central_ministry']), async (req, res) => {
  try {
    const { projectId } = req.params;
    const { approved_amount } = req.body;
    
    const project = await dbGet('SELECT * FROM projects WHERE id = ?', [projectId]);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    await dbRun(`
      UPDATE projects 
      SET approved_amount = ?, approved_by = ?, approval_date = CURRENT_TIMESTAMP, approval_status = 'Approved'
      WHERE id = ?
    `, [approved_amount, req.user.id, projectId]);
    
    const updatedProject = await dbGet('SELECT * FROM projects WHERE id = ?', [projectId]);
    res.json({ message: 'Funds approved successfully', project: updatedProject });
  } catch (error) {
    console.error('Approve funds error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ============ AGENCY ENDPOINTS ============

// Get all agencies (for central ministry)
app.get('/api/agencies', authenticateToken, authorizeRole(['central_ministry']), async (req, res) => {
  try {
    const agencies = await dbAll(`
      SELECT a.*, 
        (SELECT COUNT(*) FROM projects WHERE implementing_agency = a.id) as assignedProjectsCount,
        (SELECT COUNT(*) FROM projects WHERE implementing_agency = a.id AND (status = 'Completed' OR progress_percentage >= 100)) as completedProjectsCount
      FROM agencies a
    `);
    
    res.json(agencies);
  } catch (error) {
    console.error('Get agencies error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ============ FORUM ENDPOINTS ============

// Get forum messages
app.get('/api/forum/messages', authenticateToken, async (req, res) => {
  try {
    const messages = await dbAll('SELECT * FROM forum_messages ORDER BY timestamp DESC');
    res.json(messages);
  } catch (error) {
    console.error('Get forum messages error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Post forum message
app.post('/api/forum/messages', authenticateToken, async (req, res) => {
  try {
    const { message, project_id } = req.body;
    const userId = req.user.id;
    const userName = req.user.name;
    
    if (!message) {
      return res.status(400).json({ message: 'Message content is required' });
    }
    
    const result = await dbRun(`
      INSERT INTO forum_messages (user_id, user_name, project_id, message, type)
      VALUES (?, ?, ?, ?, 'update')
    `, [userId, userName, project_id || null, message]);
    
    const newMessage = await dbGet('SELECT * FROM forum_messages WHERE id = ?', [result.id]);
    res.json({ message: 'Message posted successfully', data: newMessage });
  } catch (error) {
    console.error('Post forum message error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ============ PROPOSAL ENDPOINTS ============

// Get proposals
app.get('/api/proposals', authenticateToken, async (req, res) => {
  try {
    const userRole = req.user.role;
    const userState = req.user.state;
    const userId = req.user.id;
    let proposals = [];
    
    if (userRole === 'central_ministry') {
      // Central Ministry sees all proposals
      proposals = await dbAll(`
        SELECT p.*, u.name as submitted_by_name, u.state as submitter_state,
               a.name as assigned_agency_name
        FROM proposals p 
        JOIN users u ON p.submitted_by = u.id 
        LEFT JOIN agencies a ON p.assigned_agency = a.id
        ORDER BY p.created_at DESC
      `);
    } else if (userRole === 'state_admin') {
      // State Admin sees only their state's proposals
      proposals = await dbAll(`
        SELECT p.*, u.name as submitted_by_name, u.state as submitter_state,
               a.name as assigned_agency_name
        FROM proposals p 
        JOIN users u ON p.submitted_by = u.id 
        LEFT JOIN agencies a ON p.assigned_agency = a.id
        WHERE p.state = ? 
        ORDER BY p.created_at DESC
      `, [userState]);
    } else if (userRole === 'implementing_agency') {
      // Agencies see proposals assigned to them or unassigned proposals matching their expertise
      proposals = await dbAll(`
        SELECT p.*, u.name as submitted_by_name, u.state as submitter_state,
               a.name as assigned_agency_name
        FROM proposals p 
        JOIN users u ON p.submitted_by = u.id 
        LEFT JOIN agencies a ON p.assigned_agency = a.id
        WHERE p.assigned_agency = ? OR p.assigned_agency IS NULL
        ORDER BY p.created_at DESC
      `, [userId]);
    }
    
    res.json(proposals);
  } catch (error) {
    console.error('Get proposals error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Assign proposal to agency (Central Ministry only)
app.put('/api/proposals/:proposalId/assign', authenticateToken, authorizeRole(['central_ministry']), async (req, res) => {
  try {
    const { proposalId } = req.params;
    const { agency_id } = req.body;
    
    if (!agency_id) {
      return res.status(400).json({ message: 'Agency ID is required' });
    }
    
    const proposal = await dbGet('SELECT * FROM proposals WHERE id = ?', [proposalId]);
    if (!proposal) {
      return res.status(404).json({ message: 'Proposal not found' });
    }
    
    const agency = await dbGet('SELECT * FROM agencies WHERE id = ?', [agency_id]);
    if (!agency) {
      return res.status(404).json({ message: 'Agency not found' });
    }
    
    await dbRun(`
      UPDATE proposals 
      SET assigned_agency = ?, assigned_date = CURRENT_TIMESTAMP, status = 'Assigned'
      WHERE id = ?
    `, [agency_id, proposalId]);
    
    const updatedProposal = await dbGet(`
      SELECT p.*, u.name as submitted_by_name, u.state as submitter_state,
             a.name as assigned_agency_name
      FROM proposals p 
      JOIN users u ON p.submitted_by = u.id 
      LEFT JOIN agencies a ON p.assigned_agency = a.id
      WHERE p.id = ?
    `, [proposalId]);
    
    res.json({ message: 'Proposal assigned successfully', proposal: updatedProposal });
  } catch (error) {
    console.error('Assign proposal error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Legacy endpoint for backward compatibility
app.get('/api/state/proposals', authenticateToken, async (req, res) => {
  // Redirect to new proposals endpoint
  req.url = '/api/proposals';
  return res.redirect('/api/proposals');
});

// Submit proposal
app.post('/api/state/proposals', authenticateToken, authorizeRole(['state_admin']), async (req, res) => {
  try {
    const { title, description, project_type, estimated_budget, timeline, district, village } = req.body;
    const userId = req.user.id;
    const userState = req.user.state;
    
    if (!title || !description || !project_type || !estimated_budget || !timeline) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }
    
    const result = await dbRun(`
      INSERT INTO proposals (title, description, project_type, estimated_budget, timeline, state, district, village, submitted_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [title, description, project_type, estimated_budget, timeline, userState, district, village, userId]);
    
    const newProposal = await dbGet('SELECT * FROM proposals WHERE id = ?', [result.id]);
    res.json({ message: 'Proposal submitted successfully', data: newProposal });
  } catch (error) {
    console.error('Submit proposal error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Review proposal (Agency only)
app.put('/api/proposals/:proposalId/review', authenticateToken, authorizeRole(['implementing_agency']), async (req, res) => {
  try {
    const { proposalId } = req.params;
    const { review_comments, status } = req.body; // status can be 'Under Review', 'Approved', 'Rejected'
    const userId = req.user.id;
    
    // Verify proposal is assigned to this agency
    const proposal = await dbGet('SELECT * FROM proposals WHERE id = ? AND assigned_agency = ?', [proposalId, userId]);
    
    if (!proposal) {
      return res.status(404).json({ message: 'Proposal not found or not assigned to your agency' });
    }
    
    // Update proposal status and review details
    await dbRun(`
      UPDATE proposals 
      SET status = ?, reviewed_by = ?, reviewed_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [status, userId, proposalId]);
    
    // If there are review comments, we should store them (would need a reviews table in production)
    // For now, we'll just update the status
    
    const updatedProposal = await dbGet(`
      SELECT p.*, u.name as submitted_by_name, u.state as submitter_state,
             a.name as assigned_agency_name, r.name as reviewed_by_name
      FROM proposals p 
      JOIN users u ON p.submitted_by = u.id 
      LEFT JOIN agencies a ON p.assigned_agency = a.id
      LEFT JOIN users r ON p.reviewed_by = r.id
      WHERE p.id = ?
    `, [proposalId]);
    
    res.json({ message: 'Proposal review updated successfully', proposal: updatedProposal });
  } catch (error) {
    console.error('Review proposal error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Accept proposal and start planning (Agency only)
app.put('/api/proposals/:proposalId/accept', authenticateToken, authorizeRole(['implementing_agency']), async (req, res) => {
  try {
    const { proposalId } = req.params;
    const { start_date, expected_completion, implementation_plan } = req.body;
    const userId = req.user.id;
    
    // Verify proposal is assigned to this agency
    const proposal = await dbGet('SELECT * FROM proposals WHERE id = ? AND assigned_agency = ?', [proposalId, userId]);
    
    if (!proposal) {
      return res.status(404).json({ message: 'Proposal not found or not assigned to your agency' });
    }
    
    // Update proposal to accepted status
    await dbRun(`
      UPDATE proposals 
      SET status = 'Accepted', reviewed_by = ?, reviewed_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [userId, proposalId]);
    
    // Create a new project based on the accepted proposal
    const projectId = `PROJ_${Date.now()}`;
    
    await dbRun(`
      INSERT INTO projects (
        id, name, description, type, state, district, village,
        budget_allocated, progress_percentage, status,
        start_date, expected_completion, implementing_agency,
        created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `, [
      projectId,
      proposal.title,
      proposal.description,
      proposal.project_type,
      proposal.state,
      proposal.district,
      proposal.village,
      proposal.estimated_budget,
      0, // Initial progress
      'Planning', // Initial status
      start_date || new Date().toISOString().split('T')[0],
      expected_completion,
      userId
    ]);
    
    // Add initial milestones for the new project
    const milestones = [
      { phase: 'Planning', status: 'In Progress' },
      { phase: 'Approval', status: 'Pending' },
      { phase: 'Implementation', status: 'Pending' },
      { phase: 'Completion', status: 'Pending' }
    ];
    
    for (const milestone of milestones) {
      await dbRun(`
        INSERT INTO milestones (project_id, phase, status)
        VALUES (?, ?, ?)
      `, [projectId, milestone.phase, milestone.status]);
    }
    
    const updatedProposal = await dbGet(`
      SELECT p.*, u.name as submitted_by_name, u.state as submitter_state,
             a.name as assigned_agency_name, r.name as reviewed_by_name
      FROM proposals p 
      JOIN users u ON p.submitted_by = u.id 
      LEFT JOIN agencies a ON p.assigned_agency = a.id
      LEFT JOIN users r ON p.reviewed_by = r.id
      WHERE p.id = ?
    `, [proposalId]);
    
    const newProject = await dbGet('SELECT * FROM projects WHERE id = ?', [projectId]);
    
    res.json({ 
      message: 'Proposal accepted and project created successfully', 
      proposal: updatedProposal,
      project: newProject
    });
  } catch (error) {
    console.error('Accept proposal error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ============ NEEDS ASSESSMENT ENDPOINTS ============

// Submit village needs assessment
app.post('/api/village/needs', authenticateToken, authorizeRole(['village_committee']), async (req, res) => {
  try {
    const { needs_type, description, priority, expected_beneficiaries, estimated_cost, justification } = req.body;
    const userId = req.user.id;
    const userState = req.user.state;
    const userDistrict = req.user.district;
    const userVillage = req.user.village;
    
    if (!needs_type || !description || !priority) {
      return res.status(400).json({ message: 'Needs type, description, and priority are required' });
    }
    
    const result = await dbRun(`
      INSERT INTO needs_assessment 
      (village, state, district, needs_type, description, priority, expected_beneficiaries, estimated_cost, justification, submitted_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [userVillage, userState, userDistrict, needs_type, description, priority, expected_beneficiaries, estimated_cost, justification, userId]);
    
    const newAssessment = await dbGet('SELECT * FROM needs_assessment WHERE id = ?', [result.id]);
    res.json({ message: 'Village needs submitted successfully', data: newAssessment });
  } catch (error) {
    console.error('Submit village needs error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get needs assessments
app.get('/api/village/needs', authenticateToken, async (req, res) => {
  try {
    const userRole = req.user.role;
    const userState = req.user.state;
    const userVillage = req.user.village;
    let needs = [];
    
    if (userRole === 'central_ministry') {
      needs = await dbAll('SELECT n.*, u.name as submitted_by_name FROM needs_assessment n JOIN users u ON n.submitted_by = u.id ORDER BY n.created_at DESC');
    } else if (userRole === 'state_admin') {
      needs = await dbAll('SELECT n.*, u.name as submitted_by_name FROM needs_assessment n JOIN users u ON n.submitted_by = u.id WHERE n.state = ? ORDER BY n.created_at DESC', [userState]);
    } else if (userRole === 'village_committee') {
      needs = await dbAll('SELECT n.*, u.name as submitted_by_name FROM needs_assessment n JOIN users u ON n.submitted_by = u.id WHERE n.village = ? ORDER BY n.created_at DESC', [userVillage]);
    }
    
    res.json(needs);
  } catch (error) {
    console.error('Get needs assessments error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ============ FEEDBACK ENDPOINTS ============

// Submit project feedback
app.post('/api/village/feedback', authenticateToken, authorizeRole(['village_committee']), async (req, res) => {
  try {
    const { project_id, feedback_type, content, rating } = req.body;
    const userId = req.user.id;
    const userState = req.user.state;
    const userVillage = req.user.village;
    
    if (!project_id || !feedback_type || !content) {
      return res.status(400).json({ message: 'Project ID, feedback type, and content are required' });
    }
    
    const result = await dbRun(`
      INSERT INTO feedback (project_id, feedback_type, content, rating, village, state, submitted_by)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [project_id, feedback_type, content, rating, userVillage, userState, userId]);
    
    const newFeedback = await dbGet('SELECT * FROM feedback WHERE id = ?', [result.id]);
    res.json({ message: 'Feedback submitted successfully', data: newFeedback });
  } catch (error) {
    console.error('Submit feedback error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get feedback
app.get('/api/state/feedback', authenticateToken, async (req, res) => {
  try {
    const userRole = req.user.role;
    const userState = req.user.state;
    let feedback = [];
    
    if (userRole === 'central_ministry') {
      feedback = await dbAll(`
        SELECT f.*, p.name as project_name, u.name as submitted_by_name 
        FROM feedback f 
        JOIN projects p ON f.project_id = p.id 
        JOIN users u ON f.submitted_by = u.id 
        ORDER BY f.created_at DESC
      `);
    } else if (userRole === 'state_admin') {
      feedback = await dbAll(`
        SELECT f.*, p.name as project_name, u.name as submitted_by_name 
        FROM feedback f 
        JOIN projects p ON f.project_id = p.id 
        JOIN users u ON f.submitted_by = u.id 
        WHERE f.state = ? 
        ORDER BY f.created_at DESC
      `, [userState]);
    }
    
    res.json(feedback);
  } catch (error) {
    console.error('Get feedback error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ============ PUBLIC ENDPOINTS ============

// Public dashboard summary
app.get('/api/public/summary', async (req, res) => {
  try {
    const totalProjects = await dbGet('SELECT COUNT(*) as count FROM projects');
    const completedProjects = await dbGet('SELECT COUNT(*) as count FROM projects WHERE status = "Completed" OR progress_percentage >= 100');
    const totalBudget = await dbGet('SELECT SUM(budget_allocated) as total FROM projects');
    const totalUtilized = await dbGet('SELECT SUM(budget_utilized) as total FROM projects');
    const activeAgencies = await dbGet('SELECT COUNT(DISTINCT implementing_agency) as count FROM projects WHERE implementing_agency IS NOT NULL');

    const summary = {
      totalProjects: totalProjects.count,
      completedProjects: completedProjects.count,
      inProgressProjects: totalProjects.count - completedProjects.count,
      totalBudgetAllocated: totalBudget.total || 0,
      totalBudgetUtilized: totalUtilized.total || 0,
      budgetUtilizationPercent: totalBudget.total ? Math.round((totalUtilized.total / totalBudget.total) * 100) : 0,
      activeAgencies: activeAgencies.count
    };

    res.json(summary);
  } catch (error) {
    console.error('Public summary error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Public projects list (limited information)
app.get('/api/public/projects', async (req, res) => {
  try {
    const projects = await dbAll(`
      SELECT
        id, name, description, type, state, district, village,
        budget_allocated, progress_percentage, status,
        start_date, expected_completion
      FROM projects
      ORDER BY created_at DESC
    `);

    res.json(projects);
  } catch (error) {
    console.error('Public projects error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Public agencies list
app.get('/api/public/agencies', async (req, res) => {
  try {
    const agencies = await dbAll(`
      SELECT
        id, name, type, contact_person, email
      FROM agencies
    `);

    res.json(agencies);
  } catch (error) {
    console.error('Public agencies error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ============ UTILITY ENDPOINTS ============

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    message: 'PM-AJAY Portal API is running successfully',
    timestamp: new Date().toISOString(),
    database: useSQLite ? 'SQLite Connected (Local Development)' : 'PostgreSQL Connected',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Get available project types
app.get('/api/project-types', (req, res) => {
  res.json([
    'Infrastructure',
    'Education',
    'Healthcare', 
    'Training',
    'Agriculture',
    'Water Management',
    'Sanitation',
    'Transportation',
    'Technology',
    'Hostel',
    'Community Center',
    'Sports',
    'Environment'
  ]);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'API endpoint not found' });
});

// Gracefully close database connection on exit
process.on('SIGINT', () => {
  console.log('Shutting down server...');
  if (useSQLite) {
    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err.message);
      } else {
        console.log('Database connection closed.');
      }
      process.exit(0);
    });
  } else {
    db.end()
      .then(() => {
        console.log('Database connection closed.');
        process.exit(0);
      })
      .catch((err) => {
        console.error('Error closing database:', err.message);
        process.exit(0);
      });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`PM-AJAY Portal API Server running on http://localhost:${PORT}`);
  console.log(`Database: ${useSQLite ? 'SQLite (Local Development)' : 'PostgreSQL'}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('\nAvailable endpoints:');
  console.log('- POST /api/auth/login - User authentication');
  console.log('- GET /api/auth/profile - Get user profile');
  console.log('- GET /api/dashboard/summary - Get dashboard summary');
  console.log('- GET /api/projects - Get projects by role');
  console.log('- PUT /api/projects/:id/status - Quick update project status');
  console.log('- PUT /api/projects/:id/progress - Detailed progress update');
  console.log('- GET /api/progress/history - Get progress history');
  console.log('- POST /api/projects/:id/approve-funds - Approve project funds');
  console.log('- GET /api/agencies - Get all agencies');
  console.log('- GET /api/forum/messages - Get forum messages');
  console.log('- POST /api/forum/messages - Post forum message');
  console.log('- GET /api/state/proposals - Get proposals');
  console.log('- POST /api/state/proposals - Submit new proposal');
  console.log('- POST /api/village/needs - Submit needs assessment');
  console.log('- GET /api/village/needs - Get needs assessments');
  console.log('- POST /api/village/feedback - Submit project feedback');
  console.log('- GET /api/state/feedback - Get project feedback');
  console.log('- GET /api/public/summary - Public dashboard summary');
  console.log('- GET /api/public/projects - Public projects list');
  console.log('- GET /api/public/agencies - Public agencies list');
  console.log('\nLogin credentials:');
  console.log('- All users: password "demo123"');
  console.log('- Usernames: ministry_admin, maharashtra_admin, haryana_admin, village_head1, village_head2, infra_agency1, skill_agency1, construction_agency1');
  console.log('- Public access: No login required for public endpoints');
});

module.exports = app;