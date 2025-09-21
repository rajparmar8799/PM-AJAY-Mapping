const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

// Database setup - use SQLite for local development, PostgreSQL for production
let db;
const useSQLite = process.env.NODE_ENV !== 'production' || !process.env.DB_HOST;

if (useSQLite) {
  const sqlite3 = require('sqlite3').verbose();

  // Create database directory if it doesn't exist
  const dbDir = path.join(__dirname, '..', 'database');
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  const dbPath = path.join(dbDir, 'pm_ajay_portal.db');

  // Remove existing database to start fresh
  if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
    console.log('Removed existing database');
  }

  db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('Error creating SQLite database:', err.message);
      return;
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
  });

  db.on('connect', () => {
    console.log('Connected to PostgreSQL database');
  });

  db.on('error', (err) => {
    console.error('Database connection error:', err);
  });
}

// Function to run SQL commands
const runQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    if (useSQLite) {
      db.run(sql, params, function(err) {
        if (err) reject(err);
        else resolve({ success: true });
      });
    } else {
      db.query(sql, params)
        .then(() => resolve({ success: true }))
        .catch(reject);
    }
  });
};

const insertData = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    if (useSQLite) {
      db.run(sql, params, function(err) {
        if (err) reject(err);
        else resolve(this.lastID);
      });
    } else {
      db.query(sql, params)
        .then(result => resolve(result.rows[0]?.id || null))
        .catch(reject);
    }
  });
};

async function initializeDatabase() {
  try {
    console.log('Creating database tables...');

    // Create Users table
    await runQuery(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(50) PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name VARCHAR(200) NOT NULL,
        email VARCHAR(200),
        role VARCHAR(50) NOT NULL,
        state VARCHAR(100),
        district VARCHAR(100),
        village VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create Agencies table
    await runQuery(`
      CREATE TABLE IF NOT EXISTS agencies (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        type VARCHAR(100) NOT NULL,
        contact_person VARCHAR(200),
        email VARCHAR(200),
        phone VARCHAR(20),
        license_no VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create Projects table
    await runQuery(`
      CREATE TABLE IF NOT EXISTS projects (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(300) NOT NULL,
        description TEXT,
        type VARCHAR(100) NOT NULL,
        state VARCHAR(100) NOT NULL,
        district VARCHAR(100) NOT NULL,
        village VARCHAR(100) NOT NULL,
        budget_allocated BIGINT NOT NULL,
        budget_utilized BIGINT DEFAULT 0,
        progress_percentage INTEGER DEFAULT 0,
        status VARCHAR(50) DEFAULT 'Planning',
        start_date DATE,
        expected_completion DATE,
        actual_completion DATE,
        implementing_agency VARCHAR(50),
        approved_by VARCHAR(50),
        approval_status VARCHAR(50) DEFAULT 'Pending',
        approval_date TIMESTAMP,
        approved_amount BIGINT,
        submitted_by VARCHAR(50),
        objectives TEXT,
        expected_beneficiaries INTEGER,
        implementation_strategy TEXT,
        monitoring_plan TEXT,
        risk_assessment TEXT,
        sustainability_plan TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (implementing_agency) REFERENCES users(id),
        FOREIGN KEY (approved_by) REFERENCES users(id),
        FOREIGN KEY (submitted_by) REFERENCES users(id)
      )
    `);

    // Create Milestones table
    await runQuery(`
      CREATE TABLE IF NOT EXISTS milestones (
        id SERIAL PRIMARY KEY,
        project_id VARCHAR(50) NOT NULL,
        phase VARCHAR(100) NOT NULL,
        description TEXT,
        status VARCHAR(50) DEFAULT 'Pending',
        planned_date DATE,
        actual_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects(id)
      )
    `);

    // Create Progress History table
    await runQuery(`
      CREATE TABLE IF NOT EXISTS progress_history (
        id SERIAL PRIMARY KEY,
        project_id VARCHAR(50) NOT NULL,
        progress_percentage INTEGER NOT NULL,
        status VARCHAR(50) NOT NULL,
        milestone VARCHAR(200),
        notes TEXT,
        issues TEXT,
        next_steps TEXT,
        files_count INTEGER DEFAULT 0,
        update_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_by VARCHAR(50) NOT NULL,
        FOREIGN KEY (project_id) REFERENCES projects(id),
        FOREIGN KEY (updated_by) REFERENCES users(id)
      )
    `);

    // Create Proposals table
    await runQuery(`
      CREATE TABLE IF NOT EXISTS proposals (
        id SERIAL PRIMARY KEY,
        title VARCHAR(300) NOT NULL,
        description TEXT NOT NULL,
        project_type VARCHAR(100) NOT NULL,
        estimated_budget BIGINT NOT NULL,
        timeline VARCHAR(100) NOT NULL,
        state VARCHAR(100) NOT NULL,
        district VARCHAR(100) NOT NULL,
        village VARCHAR(100),
        status VARCHAR(50) DEFAULT 'Submitted',
        submitted_by VARCHAR(50) NOT NULL,
        assigned_agency VARCHAR(50),
        assigned_date TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        reviewed_at TIMESTAMP,
        reviewed_by VARCHAR(50),
        FOREIGN KEY (submitted_by) REFERENCES users(id),
        FOREIGN KEY (reviewed_by) REFERENCES users(id),
        FOREIGN KEY (assigned_agency) REFERENCES agencies(id)
      )
    `);

    // Create Needs Assessment table
    await runQuery(`
      CREATE TABLE IF NOT EXISTS needs_assessment (
        id SERIAL PRIMARY KEY,
        village VARCHAR(100) NOT NULL,
        state VARCHAR(100) NOT NULL,
        district VARCHAR(100) NOT NULL,
        needs_type VARCHAR(100) NOT NULL,
        description TEXT NOT NULL,
        priority VARCHAR(20) NOT NULL,
        expected_beneficiaries INTEGER,
        estimated_cost BIGINT,
        justification TEXT,
        submitted_by VARCHAR(50) NOT NULL,
        status VARCHAR(50) DEFAULT 'Submitted',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (submitted_by) REFERENCES users(id)
      )
    `);

    // Create Feedback table
    await runQuery(`
      CREATE TABLE IF NOT EXISTS feedback (
        id SERIAL PRIMARY KEY,
        project_id VARCHAR(50) NOT NULL,
        feedback_type VARCHAR(50) NOT NULL,
        content TEXT NOT NULL,
        rating INTEGER,
        village VARCHAR(100) NOT NULL,
        state VARCHAR(100) NOT NULL,
        submitted_by VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects(id),
        FOREIGN KEY (submitted_by) REFERENCES users(id)
      )
    `);

    // Create Forum Messages table
    await runQuery(`
      CREATE TABLE IF NOT EXISTS forum_messages (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(50) NOT NULL,
        user_name VARCHAR(200) NOT NULL,
        project_id VARCHAR(50),
        message TEXT NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        type VARCHAR(20) DEFAULT 'general',
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (project_id) REFERENCES projects(id)
      )
    `);

    console.log('Database tables created successfully');

    // Insert sample data
    console.log('Inserting sample data...');

    // Hash password for all users
    const hashedPassword = await bcrypt.hash('demo123', 10);

    // Insert users
    const users = [
      {
        id: 'cm001',
        username: 'ministry_admin',
        name: 'Central Ministry Administrator',
        email: 'admin@ministry.gov.in',
        role: 'central_ministry',
        state: null,
        district: null,
        village: null
      },
      {
        id: 'sa001',
        username: 'maharashtra_admin',
        name: 'Maharashtra State Administrator',
        email: 'admin@maharashtra.gov.in',
        role: 'state_admin',
        state: 'Maharashtra',
        district: 'Mumbai',
        village: null
      },
      {
        id: 'sa002',
        username: 'haryana_admin',
        name: 'Haryana State Administrator', 
        email: 'admin@haryana.gov.in',
        role: 'state_admin',
        state: 'Haryana',
        district: 'Jhajjar',
        village: null
      },
      {
        id: 'vc001',
        username: 'village_head1',
        name: 'Village Committee Head - Thane Rural',
        email: 'head@thane.village.in',
        role: 'village_committee',
        state: 'Maharashtra',
        district: 'Mumbai',
        village: 'Thane Rural'
      },
      {
        id: 'vc002',
        username: 'village_head2',
        name: 'Village Committee Head - Ramgarh',
        email: 'head@ramgarh.village.in',
        role: 'village_committee',
        state: 'Haryana',
        district: 'Jhajjar',
        village: 'Ramgarh'
      },
      {
        id: 'ia001',
        username: 'infra_agency1',
        name: 'Bharat Infrastructure Pvt Ltd',
        email: 'contact@bharatinfra.com',
        role: 'implementing_agency',
        state: null,
        district: null,
        village: null
      },
      {
        id: 'ia002',
        username: 'skill_agency1',
        name: 'Skill Development Institute',
        email: 'contact@skilldev.org',
        role: 'implementing_agency',
        state: null,
        district: null,
        village: null
      },
      {
        id: 'ia003',
        username: 'construction_agency1',
        name: 'National Construction Corp',
        email: 'contact@ncc.in',
        role: 'implementing_agency',
        state: null,
        district: null,
        village: null
      },
      {
        id: 'public001',
        username: 'public_viewer',
        name: 'Public Viewer',
        email: 'public@pmajay.gov.in',
        role: 'public_viewer',
        state: null,
        district: null,
        village: null
      }
    ];

    for (const user of users) {
      await insertData(
        'INSERT INTO users (id, username, password, name, email, role, state, district, village) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [user.id, user.username, hashedPassword, user.name, user.email, user.role, user.state, user.district, user.village]
      );
    }

    // Insert agencies
    const agencies = [
      {
        id: 'ia001',
        name: 'Bharat Infrastructure Pvt Ltd',
        type: 'Infrastructure Development',
        contact_person: 'Eng. Suresh Patel',
        email: 'suresh.patel@bharatinfra.com',
        phone: '+91-9123456789',
        license_no: 'INFRA/2023/001'
      },
      {
        id: 'ia002',
        name: 'Skill Development Institute',
        type: 'Training & Skill Development',
        contact_person: 'Dr. Meera Gupta',
        email: 'meera.gupta@skilldev.org',
        phone: '+91-9123456788',
        license_no: 'TRAIN/2023/002'
      },
      {
        id: 'ia003',
        name: 'National Construction Corp',
        type: 'Construction & Infrastructure',
        contact_person: 'Eng. Rajesh Kumar',
        email: 'rajesh.kumar@ncc.in',
        phone: '+91-9123456787',
        license_no: 'CONST/2023/003'
      }
    ];

    for (const agency of agencies) {
      await insertData(
        'INSERT INTO agencies (id, name, type, contact_person, email, phone, license_no) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [agency.id, agency.name, agency.type, agency.contact_person, agency.email, agency.phone, agency.license_no]
      );
    }

    // Insert projects
    const projects = [
      {
        id: 'PROJ001',
        name: 'Rural Road Construction - Phase 1',
        description: 'Construction of 50km rural roads connecting 15 villages to improve connectivity and boost rural economy',
        type: 'Infrastructure',
        state: 'Maharashtra',
        district: 'Mumbai',
        village: 'Thane Rural',
        budget_allocated: 25000000,
        budget_utilized: 18750000,
        progress_percentage: 75,
        status: 'In Progress',
        start_date: '2024-01-15',
        expected_completion: '2024-12-31',
        implementing_agency: 'ia001',
        approved_by: 'cm001',
        approval_status: 'Approved',
        approved_amount: 25000000
      },
      {
        id: 'PROJ002',
        name: 'Smart Water Management System',
        description: 'IoT-based smart water distribution system with automated monitoring and leak detection',
        type: 'Infrastructure',
        state: 'Maharashtra',
        district: 'Pune',
        village: 'Shirur',
        budget_allocated: 18000000,
        budget_utilized: 5400000,
        progress_percentage: 30,
        status: 'In Progress',
        start_date: '2024-03-01',
        expected_completion: '2024-11-30',
        implementing_agency: 'ia002',
        approved_by: 'cm001',
        approval_status: 'Approved',
        approved_amount: 18000000
      },
      {
        id: 'PROJ003',
        name: 'Girls Hostel Construction',
        description: 'Construction of modern hostel facility for 100 girl students with all amenities',
        type: 'Hostel',
        state: 'Haryana',
        district: 'Jhajjar',
        village: 'Ramgarh',
        budget_allocated: 15000000,
        budget_utilized: 9000000,
        progress_percentage: 60,
        status: 'In Progress',
        start_date: '2024-01-01',
        expected_completion: '2024-10-31',
        implementing_agency: 'ia003',
        approved_by: 'cm001',
        approval_status: 'Approved',
        approved_amount: 15000000
      },
      {
        id: 'PROJ004',
        name: 'Digital Literacy Training Center',
        description: 'Establishment of digital literacy training center for 300 rural youth and women',
        type: 'Training',
        state: 'Haryana',
        district: 'Jhajjar',
        village: 'Bahadurgarh',
        budget_allocated: 8000000,
        budget_utilized: 6400000,
        progress_percentage: 80,
        status: 'Near Completion',
        start_date: '2024-02-01',
        expected_completion: '2024-08-31',
        implementing_agency: 'ia002',
        approved_by: 'cm001',
        approval_status: 'Approved',
        approved_amount: 8000000
      }
    ];

    for (const project of projects) {
      await insertData(`
        INSERT INTO projects (
          id, name, description, type, state, district, village, 
          budget_allocated, budget_utilized, progress_percentage, status,
          start_date, expected_completion, implementing_agency, approved_by,
          approval_status, approved_amount
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        project.id, project.name, project.description, project.type,
        project.state, project.district, project.village,
        project.budget_allocated, project.budget_utilized, project.progress_percentage, project.status,
        project.start_date, project.expected_completion, project.implementing_agency, project.approved_by,
        project.approval_status, project.approved_amount
      ]);
    }

    // Insert milestones
    const milestones = [
      // PROJ001 milestones
      { project_id: 'PROJ001', phase: 'Planning', status: 'Completed', planned_date: '2024-01-30', actual_date: '2024-01-30' },
      { project_id: 'PROJ001', phase: 'Land Acquisition', status: 'Completed', planned_date: '2024-03-15', actual_date: '2024-03-15' },
      { project_id: 'PROJ001', phase: 'Construction', status: 'In Progress', planned_date: '2024-04-01', actual_date: '2024-04-01' },
      { project_id: 'PROJ001', phase: 'Quality Check', status: 'Pending', planned_date: '2024-11-01', actual_date: null },
      
      // PROJ002 milestones
      { project_id: 'PROJ002', phase: 'System Design', status: 'Completed', planned_date: '2024-03-20', actual_date: '2024-03-20' },
      { project_id: 'PROJ002', phase: 'Hardware Procurement', status: 'In Progress', planned_date: '2024-04-15', actual_date: null },
      { project_id: 'PROJ002', phase: 'Installation', status: 'Pending', planned_date: '2024-07-01', actual_date: null },
      { project_id: 'PROJ002', phase: 'Testing', status: 'Pending', planned_date: '2024-10-15', actual_date: null },
      
      // PROJ003 milestones
      { project_id: 'PROJ003', phase: 'Foundation', status: 'Completed', planned_date: '2024-02-28', actual_date: '2024-02-28' },
      { project_id: 'PROJ003', phase: 'Structure', status: 'In Progress', planned_date: '2024-03-15', actual_date: null },
      { project_id: 'PROJ003', phase: 'Interior', status: 'Pending', planned_date: '2024-08-01', actual_date: null },
      { project_id: 'PROJ003', phase: 'Final Setup', status: 'Pending', planned_date: '2024-10-01', actual_date: null }
    ];

    for (const milestone of milestones) {
      await insertData(`
        INSERT INTO milestones (project_id, phase, status, planned_date, actual_date)
        VALUES (?, ?, ?, ?, ?)
      `, [milestone.project_id, milestone.phase, milestone.status, milestone.planned_date, milestone.actual_date]);
    }

    // Insert sample proposals
    const proposals = [
      {
        title: 'Rural Healthcare Center Expansion',
        description: 'Expanding the existing primary healthcare center to include specialized OPD services, diagnostic lab, and 24/7 emergency services for rural population.',
        project_type: 'Healthcare',
        estimated_budget: 12000000,
        timeline: '10 months',
        state: 'Maharashtra',
        district: 'Nashik',
        village: 'Sinnar',
        status: 'Assigned',
        submitted_by: 'sa001', // Maharashtra State Admin
        assigned_agency: 'ia001'
      },
      {
        title: 'Solar Power Installation for Schools',
        description: 'Installation of 50kW solar power systems in 10 government schools to provide sustainable electricity and reduce carbon footprint.',
        project_type: 'Infrastructure',
        estimated_budget: 8500000,
        timeline: '6 months',
        state: 'Haryana',
        district: 'Rohtak',
        village: null,
        status: 'Assigned',
        submitted_by: 'sa002', // Haryana State Admin
        assigned_agency: 'ia002'
      },
      {
        title: 'Skill Development Program for Women',
        description: 'Comprehensive skill development program for 500 rural women covering tailoring, handicrafts, food processing, and digital literacy.',
        project_type: 'Training',
        estimated_budget: 6000000,
        timeline: '8 months',
        state: 'Maharashtra',
        district: 'Aurangabad',
        village: 'Gangapur',
        status: 'Submitted',
        submitted_by: 'sa001', // Maharashtra State Admin
        assigned_agency: null
      },
      {
        title: 'Community Water Treatment Plant',
        description: 'Establishment of a community-level water treatment plant to provide safe drinking water to 5000 residents across 3 villages.',
        project_type: 'Infrastructure',
        estimated_budget: 15000000,
        timeline: '12 months',
        state: 'Haryana',
        district: 'Panipat',
        village: 'Samalkha',
        status: 'Assigned',
        submitted_by: 'sa002', // Haryana State Admin
        assigned_agency: 'ia003'
      }
    ];

    for (const proposal of proposals) {
      await insertData(`
        INSERT INTO proposals 
        (title, description, project_type, estimated_budget, timeline, state, district, village, status, submitted_by, assigned_agency, assigned_date)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        proposal.title, proposal.description, proposal.project_type, proposal.estimated_budget,
        proposal.timeline, proposal.state, proposal.district, proposal.village,
        proposal.status, proposal.submitted_by, proposal.assigned_agency,
        proposal.assigned_agency ? '2024-01-15 10:00:00' : null
      ]);
    }

    // Insert sample forum messages
    const forumMessages = [
      {
        user_id: 'ia001',
        user_name: 'Bharat Infrastructure Pvt Ltd',
        project_id: 'PROJ001',
        message: 'Rural Road Construction Phase 1 update: We have successfully completed 75% of the road construction work. Currently working on the final stretch connecting villages 12-15.',
        type: 'update'
      },
      {
        user_id: 'ia002',
        user_name: 'Skill Development Institute',
        project_id: 'PROJ004',
        message: 'Digital Literacy Training Program: We are pleased to report that 240 out of 300 rural youth have completed the basic digital literacy modules. The response has been excellent.',
        type: 'update'
      }
    ];

    for (const msg of forumMessages) {
      await insertData(`
        INSERT INTO forum_messages (user_id, user_name, project_id, message, type)
        VALUES (?, ?, ?, ?, ?)
      `, [msg.user_id, msg.user_name, msg.project_id, msg.message, msg.type]);
    }

    console.log('Sample data inserted successfully');
    console.log('Database initialization completed!');
    
    console.log('\nLogin Credentials:');
    console.log('Central Ministry: ministry_admin / demo123');
    console.log('Maharashtra State: maharashtra_admin / demo123');
    console.log('Haryana State: haryana_admin / demo123');
    console.log('Village Committee 1: village_head1 / demo123');
    console.log('Village Committee 2: village_head2 / demo123');
    console.log('Infrastructure Agency: infra_agency1 / demo123');
    console.log('Skill Development Agency: skill_agency1 / demo123');
    console.log('Construction Agency: construction_agency1 / demo123');

  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    if (useSQLite) {
      db.close((err) => {
        if (err) {
          console.error('Error closing database:', err.message);
        } else {
          console.log('Database connection closed.');
        }
      });
    } else {
      db.end()
        .then(() => console.log('Database connection closed.'))
        .catch((err) => console.error('Error closing database:', err.message));
    }
  }
}

// Run initialization
initializeDatabase();