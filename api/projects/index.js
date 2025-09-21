const { authenticateToken } = require('../_middleware');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const user = authenticateToken(req);
    const userRole = user.role;
    const userState = user.state;
    const userVillage = user.village;

    // Mock projects data
    const mockProjects = [
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
        agency_name: 'Bharat Infrastructure Pvt Ltd',
        milestones: [
          { phase: 'Planning', status: 'Completed' },
          { phase: 'Land Acquisition', status: 'Completed' },
          { phase: 'Construction', status: 'In Progress' },
          { phase: 'Quality Check', status: 'Pending' }
        ]
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
        agency_name: 'Skill Development Institute',
        milestones: [
          { phase: 'System Design', status: 'Completed' },
          { phase: 'Hardware Procurement', status: 'In Progress' },
          { phase: 'Installation', status: 'Pending' },
          { phase: 'Testing', status: 'Pending' }
        ]
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
        agency_name: 'National Construction Corp',
        milestones: [
          { phase: 'Foundation', status: 'Completed' },
          { phase: 'Structure', status: 'In Progress' },
          { phase: 'Interior', status: 'Pending' },
          { phase: 'Final Setup', status: 'Pending' }
        ]
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
        agency_name: 'Skill Development Institute',
        milestones: [
          { phase: 'Planning', status: 'Completed' },
          { phase: 'Setup', status: 'Completed' },
          { phase: 'Training', status: 'In Progress' },
          { phase: 'Certification', status: 'Pending' }
        ]
      }
    ];

    let projects = [];

    switch(userRole) {
      case 'central_ministry':
        projects = mockProjects;
        break;

      case 'state_admin':
        projects = mockProjects.filter(p => p.state === userState);
        break;

      case 'village_committee':
        projects = mockProjects.filter(p => p.village === userVillage);
        break;

      case 'implementing_agency':
        projects = mockProjects.filter(p => p.implementing_agency === user.id);
        break;
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