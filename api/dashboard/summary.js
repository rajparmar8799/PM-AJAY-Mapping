const { dbGet } = require('../_db');
const { authenticateToken } = require('../_middleware');

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const user = authenticateToken(req);
    const userRole = user.role;
    const userId = user.id;
    const userState = user.state;
    const userVillage = user.village;

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
    if (error.message === 'Access token required' || error.message === 'Invalid token') {
      return res.status(401).json({ message: error.message });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
}