// Mock data for PM-AJAY Portal - Complete offline functionality

export const mockPublicSummary = {
  totalProjects: 45,
  completedProjects: 28,
  inProgressProjects: 17,
  totalBudgetAllocated: 250000000, // 25 crores
  totalBudgetUtilized: 180000000,  // 18 crores
  budgetUtilizationPercent: 72,
  activeAgencies: 12
};

export const mockProjects = [
  {
    id: 'PROJ_001',
    name: 'Adarsh Gram Development - Village A',
    description: 'Comprehensive village development under PM-AJAY scheme including infrastructure, education and healthcare facilities.',
    type: 'Infrastructure',
    state: 'Maharashtra',
    district: 'Pune',
    village: 'Village A',
    budget_allocated: 5000000,
    budget_utilized: 3500000,
    progress_percentage: 75,
    status: 'In Progress',
    start_date: '2024-01-15',
    expected_completion: '2024-12-31',
    implementing_agency: 'agency_1',
    milestones: [
      { phase: 'Planning', status: 'Completed', date: '2024-01-15' },
      { phase: 'Foundation', status: 'Completed', date: '2024-03-01' },
      { phase: 'Construction', status: 'In Progress', date: '2024-06-01' },
      { phase: 'Completion', status: 'Pending', date: '2024-12-31' }
    ]
  },
  {
    id: 'PROJ_002',
    name: 'Hostel Construction for SC Students',
    description: 'Construction of modern hostel facility for Scheduled Caste students with capacity for 200 students.',
    type: 'Education',
    state: 'Maharashtra',
    district: 'Mumbai',
    village: 'Village B',
    budget_allocated: 15000000,
    budget_utilized: 12000000,
    progress_percentage: 85,
    status: 'Near Completion',
    start_date: '2024-02-01',
    expected_completion: '2024-11-30',
    implementing_agency: 'agency_2',
    milestones: [
      { phase: 'Planning', status: 'Completed', date: '2024-02-01' },
      { phase: 'Foundation', status: 'Completed', date: '2024-04-01' },
      { phase: 'Construction', status: 'Completed', date: '2024-08-01' },
      { phase: 'Finishing', status: 'In Progress', date: '2024-10-01' }
    ]
  },
  {
    id: 'PROJ_003',
    name: 'Rural Road Development Project',
    description: 'Construction and improvement of rural roads connecting 5 villages with modern infrastructure.',
    type: 'Infrastructure',
    state: 'Haryana',
    district: 'Gurgaon',
    village: 'Village C',
    budget_allocated: 8000000,
    budget_utilized: 6000000,
    progress_percentage: 60,
    status: 'In Progress',
    start_date: '2024-03-01',
    expected_completion: '2025-02-28',
    implementing_agency: 'agency_3',
    milestones: [
      { phase: 'Survey', status: 'Completed', date: '2024-03-01' },
      { phase: 'Planning', status: 'Completed', date: '2024-04-15' },
      { phase: 'Construction', status: 'In Progress', date: '2024-06-01' },
      { phase: 'Completion', status: 'Pending', date: '2025-02-28' }
    ]
  },
  {
    id: 'PROJ_004',
    name: 'Skill Development Center',
    description: 'Establishment of skill development center offering training in digital literacy, vocational skills, and entrepreneurship.',
    type: 'Training',
    state: 'Haryana',
    district: 'Faridabad',
    village: 'Village D',
    budget_allocated: 3000000,
    budget_utilized: 3000000,
    progress_percentage: 100,
    status: 'Completed',
    start_date: '2023-08-01',
    expected_completion: '2024-07-31',
    implementing_agency: 'agency_4',
    milestones: [
      { phase: 'Planning', status: 'Completed', date: '2023-08-01' },
      { phase: 'Setup', status: 'Completed', date: '2023-10-01' },
      { phase: 'Training', status: 'Completed', date: '2024-01-01' },
      { phase: 'Completion', status: 'Completed', date: '2024-07-31' }
    ]
  },
  {
    id: 'PROJ_005',
    name: 'Clean Water Supply System',
    description: 'Installation of clean water supply system serving 1000 households with filtration and distribution network.',
    type: 'Water Management',
    state: 'Maharashtra',
    district: 'Nagpur',
    village: 'Village E',
    budget_allocated: 12000000,
    budget_utilized: 8000000,
    progress_percentage: 45,
    status: 'In Progress',
    start_date: '2024-04-01',
    expected_completion: '2025-03-31',
    implementing_agency: 'agency_1',
    milestones: [
      { phase: 'Planning', status: 'Completed', date: '2024-04-01' },
      { phase: 'Survey', status: 'Completed', date: '2024-05-15' },
      { phase: 'Installation', status: 'In Progress', date: '2024-07-01' },
      { phase: 'Testing', status: 'Pending', date: '2025-03-31' }
    ]
  },
  {
    id: 'PROJ_006',
    name: 'Community Health Center',
    description: 'Construction of community health center with modern medical facilities and telemedicine capabilities.',
    type: 'Healthcare',
    state: 'Haryana',
    district: 'Ambala',
    village: 'Village F',
    budget_allocated: 25000000,
    budget_utilized: 15000000,
    progress_percentage: 30,
    status: 'In Progress',
    start_date: '2024-05-01',
    expected_completion: '2025-04-30',
    implementing_agency: 'agency_2',
    milestones: [
      { phase: 'Planning', status: 'Completed', date: '2024-05-01' },
      { phase: 'Foundation', status: 'In Progress', date: '2024-07-01' },
      { phase: 'Construction', status: 'Pending', date: '2024-10-01' },
      { phase: 'Equipment', status: 'Pending', date: '2025-04-30' }
    ]
  },
  {
    id: 'PROJ_007',
    name: 'Solar Power Installation',
    description: 'Installation of solar power systems for 200 households and community buildings.',
    type: 'Technology',
    state: 'Maharashtra',
    district: 'Aurangabad',
    village: 'Village G',
    budget_allocated: 18000000,
    budget_utilized: 18000000,
    progress_percentage: 100,
    status: 'Completed',
    start_date: '2023-09-01',
    expected_completion: '2024-08-31',
    implementing_agency: 'agency_3',
    milestones: [
      { phase: 'Planning', status: 'Completed', date: '2023-09-01' },
      { phase: 'Installation', status: 'Completed', date: '2024-01-01' },
      { phase: 'Testing', status: 'Completed', date: '2024-06-01' },
      { phase: 'Completion', status: 'Completed', date: '2024-08-31' }
    ]
  },
  {
    id: 'PROJ_008',
    name: 'Agricultural Support Center',
    description: 'Establishment of agricultural support center with modern farming equipment and training facilities.',
    type: 'Agriculture',
    state: 'Haryana',
    district: 'Karnal',
    village: 'Village H',
    budget_allocated: 6000000,
    budget_utilized: 4000000,
    progress_percentage: 55,
    status: 'In Progress',
    start_date: '2024-06-01',
    expected_completion: '2025-05-31',
    implementing_agency: 'agency_4',
    milestones: [
      { phase: 'Planning', status: 'Completed', date: '2024-06-01' },
      { phase: 'Construction', status: 'In Progress', date: '2024-08-01' },
      { phase: 'Equipment', status: 'Pending', date: '2024-12-01' },
      { phase: 'Training', status: 'Pending', date: '2025-05-31' }
    ]
  }
];

export const mockProposals = [
  {
    id: 'PROP_001',
    title: 'Digital Literacy Program for Rural Youth',
    description: 'Comprehensive digital literacy program targeting 500 rural youth with computer training and internet access facilities.',
    project_type: 'Technology',
    estimated_budget: 2500000,
    timeline: '12 months',
    state: 'Maharashtra',
    district: 'Pune',
    village: 'Village A',
    submitted_by: 'state_admin_1',
    submitted_by_name: 'Rajesh Kumar',
    submitter_state: 'Maharashtra',
    status: 'Assigned',
    assigned_agency: 'agency_1',
    assigned_date: '2024-09-15T10:30:00Z',
    created_at: '2024-09-01T08:00:00Z'
  },
  {
    id: 'PROP_002',
    title: 'Women Empowerment through Skill Training',
    description: 'Skill development program for rural women focusing on handicrafts, tailoring, and entrepreneurship.',
    project_type: 'Training',
    estimated_budget: 1800000,
    timeline: '10 months',
    state: 'Haryana',
    district: 'Gurgaon',
    village: 'Village C',
    submitted_by: 'state_admin_2',
    submitted_by_name: 'Priya Sharma',
    submitter_state: 'Haryana',
    status: 'Under Review',
    assigned_agency: 'agency_2',
    assigned_date: '2024-09-20T14:15:00Z',
    created_at: '2024-09-05T09:30:00Z'
  },
  {
    id: 'PROP_003',
    title: 'Sustainable Agriculture Initiative',
    description: 'Implementation of sustainable farming practices with organic farming techniques and water conservation methods.',
    project_type: 'Agriculture',
    estimated_budget: 3500000,
    timeline: '15 months',
    state: 'Maharashtra',
    district: 'Nagpur',
    village: 'Village E',
    submitted_by: 'state_admin_1',
    submitted_by_name: 'Rajesh Kumar',
    submitter_state: 'Maharashtra',
    status: 'Submitted',
    created_at: '2024-09-10T11:45:00Z'
  },
  {
    id: 'PROP_004',
    title: 'Mobile Health Clinic Services',
    description: 'Mobile health clinic providing medical services to remote villages with telemedicine capabilities.',
    project_type: 'Healthcare',
    estimated_budget: 5000000,
    timeline: '8 months',
    state: 'Haryana',
    district: 'Ambala',
    village: 'Village F',
    submitted_by: 'state_admin_2',
    submitted_by_name: 'Priya Sharma',
    submitter_state: 'Haryana',
    status: 'Accepted',
    assigned_agency: 'agency_2',
    assigned_date: '2024-09-12T16:20:00Z',
    reviewed_by: 'agency_2',
    reviewed_at: '2024-09-18T10:00:00Z',
    created_at: '2024-09-08T13:15:00Z'
  }
];

export const mockForumMessages = [
  {
    id: 'MSG_001',
    user_id: 'agency_1',
    user_name: 'Infrastructure Agency',
    project_id: 'PROJ_001',
    message: 'Foundation work for Village A development project has been completed successfully. Moving to construction phase.',
    timestamp: '2024-09-20T09:30:00Z',
    type: 'update'
  },
  {
    id: 'MSG_002',
    user_id: 'ministry_admin',
    user_name: 'Central Ministry',
    project_id: null,
    message: 'All agencies are requested to submit quarterly progress reports by end of this month.',
    timestamp: '2024-09-19T14:15:00Z',
    type: 'announcement'
  },
  {
    id: 'MSG_003',
    user_id: 'agency_2',
    user_name: 'Education Agency',
    project_id: 'PROJ_002',
    message: 'Hostel construction is 85% complete. Electrical and plumbing work remaining.',
    timestamp: '2024-09-18T11:45:00Z',
    type: 'update'
  },
  {
    id: 'MSG_004',
    user_id: 'state_admin_1',
    user_name: 'Maharashtra State Admin',
    project_id: 'PROJ_005',
    message: 'Water supply project facing delay due to monsoon season. Expected completion extended by 2 weeks.',
    timestamp: '2024-09-17T16:20:00Z',
    type: 'update'
  },
  {
    id: 'MSG_005',
    user_id: 'agency_3',
    user_name: 'Rural Development Agency',
    project_id: 'PROJ_003',
    message: 'Road construction work progressing well. 60% completion achieved. Quality checks passed.',
    timestamp: '2024-09-16T08:45:00Z',
    type: 'update'
  }
];

export const mockProgressHistory = [
  {
    id: 'HIST_001',
    project_id: 'PROJ_001',
    progress_percentage: 75,
    status: 'In Progress',
    milestone: 'Construction Phase',
    notes: 'Main building structure completed. Electrical and plumbing work in progress.',
    issues: 'Minor delay due to material shortage',
    next_steps: 'Complete interior finishing and testing',
    update_date: '2024-09-20T09:30:00Z',
    updated_by: 'agency_1'
  },
  {
    id: 'HIST_002',
    project_id: 'PROJ_002',
    progress_percentage: 85,
    status: 'Near Completion',
    milestone: 'Finishing Work',
    notes: 'Hostel building construction completed. Working on interior finishing.',
    issues: 'None',
    next_steps: 'Furniture installation and final inspection',
    update_date: '2024-09-18T11:45:00Z',
    updated_by: 'agency_2'
  },
  {
    id: 'HIST_003',
    project_id: 'PROJ_003',
    progress_percentage: 60,
    status: 'In Progress',
    milestone: 'Construction Phase',
    notes: 'Road construction progressing as per schedule. Quality standards maintained.',
    issues: 'Weather delays during monsoon',
    next_steps: 'Complete remaining 2km stretch',
    update_date: '2024-09-16T08:45:00Z',
    updated_by: 'agency_3'
  },
  {
    id: 'HIST_004',
    project_id: 'PROJ_004',
    progress_percentage: 100,
    status: 'Completed',
    milestone: 'Project Completion',
    notes: 'Skill development center fully operational. 200 students enrolled.',
    issues: 'None',
    next_steps: 'Monitor and evaluate program impact',
    update_date: '2024-08-15T14:20:00Z',
    updated_by: 'agency_4'
  },
  {
    id: 'HIST_005',
    project_id: 'PROJ_005',
    progress_percentage: 45,
    status: 'In Progress',
    milestone: 'Installation Phase',
    notes: 'Water supply system installation ongoing. Pipeline laying completed for 60% area.',
    issues: 'Ground water table variations affecting drilling',
    next_steps: 'Complete pipeline installation and testing',
    update_date: '2024-09-17T16:20:00Z',
    updated_by: 'agency_1'
  }
];

export const mockAgencies = [
  {
    id: 'agency_1',
    name: 'National Infrastructure Development Agency',
    type: 'Infrastructure',
    contact_person: 'Dr. Amit Sharma',
    email: 'amit.sharma@nida.gov.in',
    phone: '+91-9876543210',
    expertise: ['Roads', 'Buildings', 'Water Supply', 'Sanitation'],
    assignedProjectsCount: 3,
    completedProjectsCount: 1
  },
  {
    id: 'agency_2',
    name: 'Education & Skill Development Corporation',
    type: 'Education',
    contact_person: 'Ms. Priya Singh',
    email: 'priya.singh@esdc.gov.in',
    phone: '+91-9876543211',
    expertise: ['Schools', 'Hostels', 'Training Centers', 'Digital Literacy'],
    assignedProjectsCount: 2,
    completedProjectsCount: 1
  },
  {
    id: 'agency_3',
    name: 'Rural Technology Solutions',
    type: 'Technology',
    contact_person: 'Mr. Rajesh Kumar',
    email: 'rajesh.kumar@rts.gov.in',
    phone: '+91-9876543212',
    expertise: ['Solar Power', 'Digital Infrastructure', 'Telemedicine', 'Smart Agriculture'],
    assignedProjectsCount: 2,
    completedProjectsCount: 1
  },
  {
    id: 'agency_4',
    name: 'Agricultural Development Agency',
    type: 'Agriculture',
    contact_person: 'Dr. Sunita Patel',
    email: 'sunita.patel@ada.gov.in',
    phone: '+91-9876543213',
    expertise: ['Sustainable Farming', 'Irrigation', 'Organic Farming', 'Agricultural Training'],
    assignedProjectsCount: 1,
    completedProjectsCount: 0
  }
];

// Mock users for different roles
export const mockUsers = [
  {
    id: 'ministry_admin',
    username: 'ministry_admin',
    name: 'Central Ministry Administrator',
    role: 'central_ministry',
    state: null,
    district: null,
    village: null
  },
  {
    id: 'state_admin_1',
    username: 'maharashtra_admin',
    name: 'Maharashtra State Administrator',
    role: 'state_admin',
    state: 'Maharashtra',
    district: 'Pune',
    village: null
  },
  {
    id: 'state_admin_2',
    username: 'haryana_admin',
    name: 'Haryana State Administrator',
    role: 'state_admin',
    state: 'Haryana',
    district: 'Gurgaon',
    village: null
  },
  {
    id: 'village_committee_1',
    username: 'village_head1',
    name: 'Village Head - Village A',
    role: 'village_committee',
    state: 'Maharashtra',
    district: 'Pune',
    village: 'Village A'
  },
  {
    id: 'village_committee_2',
    username: 'village_head2',
    name: 'Village Head - Village C',
    role: 'village_committee',
    state: 'Haryana',
    district: 'Gurgaon',
    village: 'Village C'
  },
  {
    id: 'agency_1',
    username: 'infra_agency1',
    name: 'Infrastructure Agency Lead',
    role: 'implementing_agency',
    state: null,
    district: null,
    village: null
  },
  {
    id: 'agency_2',
    username: 'skill_agency1',
    name: 'Skill Development Agency Lead',
    role: 'implementing_agency',
    state: null,
    district: null,
    village: null
  },
  {
    id: 'agency_3',
    username: 'construction_agency1',
    name: 'Construction Agency Lead',
    role: 'implementing_agency',
    state: null,
    district: null,
    village: null
  }
];