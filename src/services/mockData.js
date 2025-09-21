// Mock data for PM-AJAY Portal when backend is not available

export const mockPublicSummary = {
  totalProjects: 4,
  completedProjects: 1,
  inProgressProjects: 3,
  totalBudgetAllocated: 66000000,
  totalBudgetUtilized: 42600000,
  budgetUtilizationPercent: 65,
  activeAgencies: 3
};

export const mockProjects = [
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
    approval_status: 'Approved',
    approved_amount: 25000000
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
    approval_status: 'Approved',
    approved_amount: 18000000
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
    approval_status: 'Approved',
    approved_amount: 15000000
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
    approval_status: 'Approved',
    approved_amount: 8000000
  }
];

export const mockAgencies = [
  {
    id: 'ia001',
    name: 'Bharat Infrastructure Pvt Ltd',
    type: 'Infrastructure Development',
    contact_person: 'Eng. Suresh Patel',
    email: 'suresh.patel@bharatinfra.com',
    phone: '+91-9123456789',
    license_no: 'INFRA/2023/001',
    assignedProjectsCount: 1,
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
    completedProjectsCount: 0
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

export const mockForumMessages = [
  {
    id: 1,
    user_id: 'ia001',
    user_name: 'Bharat Infrastructure Pvt Ltd',
    project_id: 'PROJ001',
    message: 'Rural Road Construction Phase 1 update: We have successfully completed 75% of the road construction work. Currently working on the final stretch connecting villages 12-15.',
    timestamp: '2024-06-15T10:30:00Z',
    type: 'update'
  },
  {
    id: 2,
    user_id: 'ia002',
    user_name: 'Skill Development Institute',
    project_id: 'PROJ004',
    message: 'Digital Literacy Training Program: We are pleased to report that 240 out of 300 rural youth have completed the basic digital literacy modules. The response has been excellent.',
    timestamp: '2024-06-14T14:20:00Z',
    type: 'update'
  }
];