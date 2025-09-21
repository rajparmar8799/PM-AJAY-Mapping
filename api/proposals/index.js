const { authenticateToken } = require('../_middleware');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const user = authenticateToken(req);
    const userRole = user.role;
    const userState = user.state;
    const userId = user.id;

    // Mock proposals data
    const mockProposals = [
      {
        id: 1,
        title: 'Rural Healthcare Center Expansion',
        description: 'Expanding the existing primary healthcare center to include specialized OPD services, diagnostic lab, and 24/7 emergency services for rural population.',
        project_type: 'Healthcare',
        estimated_budget: 12000000,
        timeline: '10 months',
        state: 'Maharashtra',
        district: 'Nashik',
        village: 'Sinnar',
        status: 'Assigned',
        submitted_by: 'sa001',
        submitted_by_name: 'Maharashtra State Administrator',
        submitter_state: 'Maharashtra',
        assigned_agency: 'ia001',
        assigned_date: '2024-01-15T10:00:00Z'
      },
      {
        id: 2,
        title: 'Solar Power Installation for Schools',
        description: 'Installation of 50kW solar power systems in 10 government schools to provide sustainable electricity and reduce carbon footprint.',
        project_type: 'Infrastructure',
        estimated_budget: 8500000,
        timeline: '6 months',
        state: 'Haryana',
        district: 'Rohtak',
        village: null,
        status: 'Assigned',
        submitted_by: 'sa002',
        submitted_by_name: 'Haryana State Administrator',
        submitter_state: 'Haryana',
        assigned_agency: 'ia002',
        assigned_date: '2024-01-16T10:00:00Z'
      },
      {
        id: 3,
        title: 'Skill Development Program for Women',
        description: 'Comprehensive skill development program for 500 rural women covering tailoring, handicrafts, food processing, and digital literacy.',
        project_type: 'Training',
        estimated_budget: 6000000,
        timeline: '8 months',
        state: 'Maharashtra',
        district: 'Aurangabad',
        village: 'Gangapur',
        status: 'Submitted',
        submitted_by: 'sa001',
        submitted_by_name: 'Maharashtra State Administrator',
        submitter_state: 'Maharashtra',
        assigned_agency: null,
        assigned_date: null
      }
    ];

    let proposals = [];

    if (userRole === 'central_ministry') {
      // Central Ministry sees all proposals
      proposals = mockProposals;
    } else if (userRole === 'state_admin') {
      // State Admin sees only their state's proposals
      proposals = mockProposals.filter(p => p.state === userState);
    } else if (userRole === 'implementing_agency') {
      // Agencies see proposals assigned to them or unassigned proposals
      proposals = mockProposals.filter(p => p.assigned_agency === userId || p.assigned_agency === null);
    }

    res.json(proposals);
  } catch (error) {
    console.error('Get proposals error:', error);
    if (error.message === 'Access token required' || error.message === 'Invalid token') {
      return res.status(401).json({ message: error.message });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
}