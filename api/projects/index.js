const { dbAll } = require('../_db');
const { authenticateToken } = require('../_middleware');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const user = authenticateToken(req);
    const userRole = user.role;
    const userId = user.id;
    const userState = user.state;
    const userVillage = user.village;
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
    if (error.message === 'Access token required' || error.message === 'Invalid token') {
      return res.status(401).json({ message: error.message });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
}