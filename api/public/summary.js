const { dbGet } = require('../_db');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

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
}