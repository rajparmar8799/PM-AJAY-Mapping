const { authenticateToken } = require('../_middleware');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const user = authenticateToken(req);
    const userRole = user.role;

    // Only central ministry can access agencies
    if (userRole !== 'central_ministry') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Mock agencies data
    const mockAgencies = [
      {
        id: 'ia001',
        name: 'Bharat Infrastructure Pvt Ltd',
        type: 'Infrastructure Development',
        contact_person: 'Eng. Suresh Patel',
        email: 'suresh.patel@bharatinfra.com',
        phone: '+91-9123456789',
        license_no: 'INFRA/2023/001',
        assignedProjectsCount: 2,
        completedProjectsCount: 0
      },
      {
        id: 'ia002',
        name: 'Skill Development Institute',
        type: 'Training & Skill Development',
        contact_person: 'Dr. Meera Gupta',
        email: 'meera.gupta@skilldev.org',
        phone: '+91-9123456788',
        license_no: 'TRAIN/2023/002',
        assignedProjectsCount: 2,
        completedProjectsCount: 1
      },
      {
        id: 'ia003',
        name: 'National Construction Corp',
        type: 'Construction & Infrastructure',
        contact_person: 'Eng. Rajesh Kumar',
        email: 'rajesh.kumar@ncc.in',
        phone: '+91-9123456787',
        license_no: 'CONST/2023/003',
        assignedProjectsCount: 1,
        completedProjectsCount: 0
      }
    ];

    res.json(mockAgencies);
  } catch (error) {
    console.error('Get agencies error:', error);
    if (error.message === 'Access token required' || error.message === 'Invalid token') {
      return res.status(401).json({ message: error.message });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
}