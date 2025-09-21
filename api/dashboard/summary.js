const { authenticateToken } = require('../_middleware');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const user = authenticateToken(req);
    const userRole = user.role;

    // Mock data for dashboard summary
    let summary = {};

    switch(userRole) {
      case 'central_ministry':
        summary = {
          totalProjects: 4,
          completedProjects: 1,
          inProgressProjects: 3,
          totalBudgetAllocated: 66000000,
          totalBudgetUtilized: 38150000,
          budgetUtilizationPercent: 58,
          activeAgencies: 3,
          averageProgress: 61
        };
        break;

      case 'state_admin':
        summary = {
          stateProjects: 2,
          completedProjects: 1,
          inProgressProjects: 1,
          budgetAllocated: 33000000,
          budgetUtilized: 24150000,
          budgetUtilizationPercent: 73,
          averageProgress: 55
        };
        break;

      case 'village_committee':
        summary = {
          villageProjects: 1,
          completedProjects: 0,
          inProgressProjects: 1,
          budgetAllocated: 15000000,
          averageProgress: 60
        };
        break;

      case 'implementing_agency':
        summary = {
          assignedProjects: 2,
          completedProjects: 0,
          inProgressProjects: 2,
          totalBudget: 43000000,
          averageProgress: 52
        };
        break;
    }

    res.json(summary);
  } catch (error) {
    console.error('Dashboard summary error:', error);
    if (error.message === 'Access token required' || error.message === 'Invalid token') {
      return res.status(401).json({ message: error.message });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
}