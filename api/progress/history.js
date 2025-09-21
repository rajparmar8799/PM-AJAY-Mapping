const { authenticateToken } = require('../_middleware');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const user = authenticateToken(req);
    const userId = user.id;
    const userRole = user.role;

    // Mock progress history data
    const mockHistory = [
      {
        id: 1,
        project_id: 'PROJ001',
        progress_percentage: 75,
        status: 'In Progress',
        milestone: 'Final road construction phase',
        notes: 'Completed 75% of rural road construction. Working on connecting villages 12-15.',
        issues: 'Minor delay due to monsoon season',
        next_steps: 'Complete final 25% of road construction and quality testing',
        files_count: 3,
        update_date: '2024-09-20T10:30:00Z',
        updated_by: 'ia001',
        project_name: 'Rural Road Construction - Phase 1'
      },
      {
        id: 2,
        project_id: 'PROJ002',
        progress_percentage: 30,
        status: 'In Progress',
        milestone: 'Hardware procurement completed',
        notes: 'IoT sensors and monitoring equipment have been procured and tested.',
        issues: 'None',
        next_steps: 'Begin installation of smart water distribution system',
        files_count: 2,
        update_date: '2024-09-19T14:15:00Z',
        updated_by: 'ia002',
        project_name: 'Smart Water Management System'
      },
      {
        id: 3,
        project_id: 'PROJ003',
        progress_percentage: 60,
        status: 'In Progress',
        milestone: 'Structure construction completed',
        notes: 'Hostel building structure is complete. Moving to interior work.',
        issues: 'Material delivery delay of 1 week',
        next_steps: 'Complete interior finishing and furniture installation',
        files_count: 4,
        update_date: '2024-09-18T09:00:00Z',
        updated_by: 'ia003',
        project_name: 'Girls Hostel Construction'
      },
      {
        id: 4,
        project_id: 'PROJ004',
        progress_percentage: 80,
        status: 'Near Completion',
        milestone: 'Training completion phase',
        notes: '240 out of 300 participants completed digital literacy training.',
        issues: 'None',
        next_steps: 'Final certification and project evaluation',
        files_count: 1,
        update_date: '2024-09-17T16:45:00Z',
        updated_by: 'ia002',
        project_name: 'Digital Literacy Training Center'
      }
    ];

    let history = [];

    if (userRole === 'implementing_agency') {
      // Agencies see only their projects' history
      history = mockHistory.filter(h => h.updated_by === userId);
    } else {
      // Central ministry and state admins see all history
      history = mockHistory;
    }

    // Sort by update date (newest first)
    history.sort((a, b) => new Date(b.update_date) - new Date(a.update_date));

    res.json(history);
  } catch (error) {
    console.error('Get progress history error:', error);
    if (error.message === 'Access token required' || error.message === 'Invalid token') {
      return res.status(401).json({ message: error.message });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
}