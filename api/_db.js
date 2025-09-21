// Mock data for Vercel serverless functions
const bcrypt = require('bcryptjs');

// Mock users data
const mockUsers = [
  {
    id: 'cm001',
    username: 'ministry_admin',
    password: '$2a$10$hashedpassword', // Will be set properly
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
    password: '$2a$10$hashedpassword',
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
    password: '$2a$10$hashedpassword',
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
    password: '$2a$10$hashedpassword',
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
    password: '$2a$10$hashedpassword',
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
    password: '$2a$10$hashedpassword',
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
    password: '$2a$10$hashedpassword',
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
    password: '$2a$10$hashedpassword',
    name: 'National Construction Corp',
    email: 'contact@ncc.in',
    role: 'implementing_agency',
    state: null,
    district: null,
    village: null
  }
];

// Initialize hashed passwords
const initializePasswords = async () => {
  const hashedPassword = await bcrypt.hash('demo123', 10);
  mockUsers.forEach(user => {
    user.password = hashedPassword;
  });
};

// Mock database helper functions
const dbGet = async (sql, params = []) => {
  // Simple mock implementation for login
  if (sql.includes('SELECT * FROM users WHERE username = ? AND role = ?')) {
    const [username, role] = params;
    return mockUsers.find(user => user.username === username && user.role === role) || null;
  }
  return null;
};

const dbAll = async (sql, params = []) => {
  // Return empty arrays for other queries to prevent errors
  return [];
};

const dbRun = async (sql, params = []) => {
  // Mock successful operation
  return { id: Date.now().toString(), changes: 1 };
};

// Initialize passwords on module load
initializePasswords().catch(console.error);

module.exports = { dbGet, dbAll, dbRun };