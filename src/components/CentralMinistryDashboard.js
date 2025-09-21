import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { mockPublicSummary, mockProjects, mockAgencies } from '../services/mockData';
import './Dashboard.css';

const CentralMinistryDashboard = ({ user }) => {
  const [summary, setSummary] = useState(null);
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Search and Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [componentFilter, setComponentFilter] = useState('');
  const [agencyFilter, setAgencyFilter] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  // Filter projects based on search and filter criteria
  useEffect(() => {
    let filtered = [...projects];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.agency_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter) {
      filtered = filtered.filter(project => project.status === statusFilter);
    }

    // State filter
    if (stateFilter) {
      filtered = filtered.filter(project => project.state === stateFilter);
    }

    // Component filter
    if (componentFilter) {
      filtered = filtered.filter(project => project.type === componentFilter);
    }

    // Agency filter
    if (agencyFilter) {
      filtered = filtered.filter(project => project.agency_name === agencyFilter);
    }

    setFilteredProjects(filtered);
  }, [projects, searchTerm, statusFilter, stateFilter, componentFilter, agencyFilter]);

  const fetchData = async () => {
    // Use mock data directly for demo purposes
    setLoading(true);
    setTimeout(() => {
      setSummary(mockPublicSummary);
      setProjects(mockProjects);
      setFilteredProjects(mockProjects);
      setAgencies(mockAgencies);
      setLoading(false);
    }, 1000); // Simulate loading time
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getProgressBarClass = (percentage) => {
    if (percentage >= 80) return 'bg-success';
    if (percentage >= 50) return 'bg-warning';
    return 'bg-danger';
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return 'badge badge-success';
      case 'In Progress':
        return 'badge badge-info';
      case 'Near Completion':
        return 'badge badge-warning';
      default:
        return 'badge badge-secondary';
    }
  };

  const approveFunds = async (projectId, amount) => {
    try {
      console.log('Approving funds for project:', projectId, 'Amount:', amount);
      
      const response = await api.post(`/api/projects/${projectId}/approve-funds`, {
        approved_amount: amount
      });
      
      console.log('Approval response:', response.data);
      
      // Refresh data after approval
      await fetchData();
      
      alert(`Funds approved successfully!\n\nProject: ${response.data.project?.name || 'Unknown'}\nApproved Amount: ${formatCurrency(amount)}\nStatus: Approved`);
      
    } catch (error) {
      console.error('Error approving funds:', error);
      alert(`Error approving funds: ${error.response?.data?.message || error.message}\nPlease try again.`);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container fade-in">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Central Ministry Dashboard</h1>
        <p className="dashboard-subtitle">Policy Management & Fund Allocation</p>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="summary-section">
          <h2 className="section-title">Executive Summary</h2>
          <div className="summary-grid">
            <div className="summary-card">
              <div className="summary-icon">📊</div>
              <div className="summary-content">
                <h3>{summary.totalProjects}</h3>
                <p>Total Projects</p>
              </div>
            </div>
            <div className="summary-card">
              <div className="summary-icon">✅</div>
              <div className="summary-content">
                <h3>{summary.completedProjects}</h3>
                <p>Completed Projects</p>
              </div>
            </div>
            <div className="summary-card">
              <div className="summary-icon">💰</div>
              <div className="summary-content">
                <h3>{formatCurrency(summary.totalBudgetAllocated)}</h3>
                <p>Total Budget Allocated</p>
              </div>
            </div>
            <div className="summary-card">
              <div className="summary-icon">📈</div>
              <div className="summary-content">
                <h3>{summary.budgetUtilizationPercent}%</h3>
                <p>Budget Utilization</p>
              </div>
            </div>
            <div className="summary-card">
              <div className="summary-icon">🏗️</div>
              <div className="summary-content">
                <h3>{summary.activeAgencies}</h3>
                <p>Active Agencies</p>
              </div>
            </div>
            <div className="summary-card">
              <div className="summary-icon">⚡</div>
              <div className="summary-content">
                <h3>{summary.averageProgress}%</h3>
                <p>Average Progress</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter Section */}
      {activeTab === 'overview' && (
        <div className="search-filter-section">
          <div className="search-filter-grid">
            <div className="search-input">
              <input
                type="text"
                placeholder="Search projects, states, agencies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-control"
              />
            </div>
            <div className="filter-select">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="form-control"
              >
                <option value="">All Status</option>
                <option value="Planning">Planning</option>
                <option value="In Progress">In Progress</option>
                <option value="Near Completion">Near Completion</option>
                <option value="Completed">Completed</option>
                <option value="Delayed">Delayed</option>
              </select>
            </div>
            <div className="filter-select">
              <select
                value={stateFilter}
                onChange={(e) => setStateFilter(e.target.value)}
                className="form-control"
              >
                <option value="">All States</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Haryana">Haryana</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="Rajasthan">Rajasthan</option>
                <option value="Gujarat">Gujarat</option>
              </select>
            </div>
            <div className="filter-select">
              <select
                value={componentFilter}
                onChange={(e) => setComponentFilter(e.target.value)}
                className="form-control"
              >
                <option value="">All Components</option>
                <option value="Adarsh Gram">Adarsh Gram</option>
                <option value="GIA">GIA</option>
                <option value="Hostel">Hostel</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="Training">Training</option>
              </select>
            </div>
            <div className="filter-select">
              <select
                value={agencyFilter}
                onChange={(e) => setAgencyFilter(e.target.value)}
                className="form-control"
              >
                <option value="">All Agencies</option>
                {agencies.map(agency => (
                  <option key={agency.id} value={agency.name}>{agency.name}</option>
                ))}
              </select>
            </div>
            <div className="filter-actions">
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('');
                  setStateFilter('');
                  setComponentFilter('');
                  setAgencyFilter('');
                }}
              >
                Clear Filters
              </button>
            </div>
          </div>
          <div className="filter-results">
            <p>Showing {filteredProjects.length} of {projects.length} projects</p>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="tab-navigation">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Project Overview
        </button>
        <button 
          className={`tab-btn ${activeTab === 'approvals' ? 'active' : ''}`}
          onClick={() => setActiveTab('approvals')}
        >
          Pending Approvals
        </button>
        <button
          className={`tab-btn ${activeTab === 'agencies' ? 'active' : ''}`}
          onClick={() => setActiveTab('agencies')}
        >
          Agency Management
        </button>
        <button
          className={`tab-btn ${activeTab === 'repository' ? 'active' : ''}`}
          onClick={() => setActiveTab('repository')}
        >
          Digital Repository
        </button>
        <button
          className={`tab-btn ${activeTab === 'fundflow' ? 'active' : ''}`}
          onClick={() => setActiveTab('fundflow')}
        >
          Fund Flow Tracker
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'overview' && (
          <div className="projects-section">
            <h2 className="section-title">All Projects Status</h2>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Project Name</th>
                    <th>State</th>
                    <th>Type</th>
                    <th>Budget Allocated</th>
                    <th>Budget Utilized</th>
                    <th>Progress</th>
                    <th>Status</th>
                    <th>Approval Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProjects.map(project => (
                    <tr key={project.id}>
                      <td>
                        <strong>{project.name}</strong>
                        <div className="project-description">{project.description}</div>
                      </td>
                      <td>{project.state}</td>
                      <td>
                        <span className="project-type">{project.type}</span>
                      </td>
                      <td>{formatCurrency(project.budget_allocated)}</td>
                      <td>{formatCurrency(project.budget_utilized)}</td>
                      <td>
                        <div className="progress">
                          <div 
                            className={`progress-bar ${getProgressBarClass(project.progress_percentage)}`}
                            style={{ width: `${project.progress_percentage}%` }}
                          ></div>
                        </div>
                        <small>{project.progress_percentage}%</small>
                      </td>
                      <td>
                        <span className={getStatusBadge(project.status)}>{project.status}</span>
                      </td>
                      <td>
                        <span className={project.approval_status === 'Approved' ? 'badge badge-success' : 'badge badge-warning'}>
                          {project.approval_status || 'Pending'}
                        </span>
                        {project.approved_amount && (
                          <div style={{fontSize: '0.8rem', marginTop: '4px'}}>
                            Approved: {formatCurrency(project.approved_amount)}
                          </div>
                        )}
                      </td>
                      <td>
                        <button 
                          className={project.approval_status === 'Approved' ? 'btn btn-success btn-sm' : 'btn btn-primary btn-sm'}
                          onClick={() => approveFunds(project.id, project.budget_allocated)}
                          title={project.approval_status === 'Approved' ? 'Re-approve Funds' : 'Approve Project Funds'}
                          disabled={project.approval_status === 'Approved'}
                        >
                          {project.approval_status === 'Approved' ? '✅ Approved' : '💰 Approve'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'repository' && (
          <div className="repository-section">
            <h2 className="section-title">Digital Repository - Agency Profiles</h2>
            <div className="repository-grid">
              {agencies.map(agency => (
                <div key={agency.id} className="repository-card card">
                  <div className="card-header">
                    <h3>{agency.name}</h3>
                    <span className="agency-type-badge">{agency.type}</span>
                  </div>
                  <div className="card-body">
                    <div className="agency-details">
                      <div className="detail-section">
                        <h4>Contact Information</h4>
                        <p><strong>Contact Person:</strong> {agency.contact_person}</p>
                        <p><strong>Email:</strong> {agency.email}</p>
                        <p><strong>Phone:</strong> {agency.phone}</p>
                        <p><strong>License:</strong> {agency.license_no}</p>
                      </div>

                      <div className="detail-section">
                        <h4>Performance Metrics</h4>
                        <div className="metrics-grid">
                          <div className="metric">
                            <span className="metric-value">{agency.assignedProjectsCount}</span>
                            <span className="metric-label">Assigned Projects</span>
                          </div>
                          <div className="metric">
                            <span className="metric-value">{agency.completedProjectsCount}</span>
                            <span className="metric-label">Completed Projects</span>
                          </div>
                          <div className="metric">
                            <span className="metric-value">
                              {agency.assignedProjectsCount > 0
                                ? Math.round((agency.completedProjectsCount / agency.assignedProjectsCount) * 100)
                                : 0}%
                            </span>
                            <span className="metric-label">Success Rate</span>
                          </div>
                        </div>
                      </div>

                      <div className="detail-section">
                        <h4>Roles & Responsibilities</h4>
                        <ul className="responsibilities-list">
                          <li>Project implementation and execution</li>
                          <li>Fund utilization and reporting</li>
                          <li>Progress tracking and milestone updates</li>
                          <li>Quality assurance and compliance</li>
                          <li>Stakeholder coordination</li>
                        </ul>
                      </div>

                      <div className="detail-section">
                        <h4>Expertise Areas</h4>
                        <div className="expertise-tags">
                          {agency.type.toLowerCase().includes('infrastructure') && (
                            <span className="expertise-tag">Infrastructure</span>
                          )}
                          {agency.type.toLowerCase().includes('construction') && (
                            <span className="expertise-tag">Construction</span>
                          )}
                          {agency.type.toLowerCase().includes('training') && (
                            <span className="expertise-tag">Training</span>
                          )}
                          {agency.type.toLowerCase().includes('skill') && (
                            <span className="expertise-tag">Skill Development</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'fundflow' && (
          <div className="fundflow-section">
            <h2 className="section-title">Fund Flow Tracker</h2>

            {/* Overall Fund Summary */}
            <div className="fund-summary">
              <div className="fund-summary-grid">
                <div className="fund-summary-card">
                  <div className="fund-icon">💰</div>
                  <div className="fund-content">
                    <h3>{formatCurrency(summary.totalBudgetAllocated)}</h3>
                    <p>Total Funds Allocated</p>
                  </div>
                </div>
                <div className="fund-summary-card">
                  <div className="fund-icon">📊</div>
                  <div className="fund-content">
                    <h3>{formatCurrency(summary.totalBudgetUtilized)}</h3>
                    <p>Total Funds Utilized</p>
                  </div>
                </div>
                <div className="fund-summary-card">
                  <div className="fund-icon">📈</div>
                  <div className="fund-content">
                    <h3>{summary.budgetUtilizationPercent}%</h3>
                    <p>Utilization Rate</p>
                  </div>
                </div>
                <div className="fund-summary-card">
                  <div className="fund-icon">⏳</div>
                  <div className="fund-content">
                    <h3>{formatCurrency(summary.totalBudgetAllocated - summary.totalBudgetUtilized)}</h3>
                    <p>Pending Utilization</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Fund Flow Visualization */}
            <div className="fund-flow-visualization">
              <h3>Fund Flow from Central Ministry to Agencies</h3>
              <div className="flow-diagram">
                <div className="flow-level">
                  <div className="flow-node central-node">
                    <div className="node-icon">🏛️</div>
                    <div className="node-content">
                      <h4>Central Ministry</h4>
                      <p>{formatCurrency(summary.totalBudgetAllocated)}</p>
                      <small>Total Allocation</small>
                    </div>
                  </div>
                </div>

                <div className="flow-arrow">↓</div>

                <div className="flow-level">
                  <div className="agency-flow-grid">
                    {agencies.map(agency => {
                      const agencyProjects = projects.filter(p => p.implementing_agency === agency.id);
                      const agencyBudget = agencyProjects.reduce((sum, p) => sum + p.budget_allocated, 0);
                      const agencyUtilized = agencyProjects.reduce((sum, p) => sum + p.budget_utilized, 0);
                      const utilizationRate = agencyBudget > 0 ? Math.round((agencyUtilized / agencyBudget) * 100) : 0;

                      return (
                        <div key={agency.id} className="flow-node agency-node">
                          <div className="node-icon">🏢</div>
                          <div className="node-content">
                            <h4>{agency.name}</h4>
                            <div className="fund-details">
                              <p className="allocated">Allocated: {formatCurrency(agencyBudget)}</p>
                              <p className="utilized">Utilized: {formatCurrency(agencyUtilized)}</p>
                              <p className="rate">Rate: {utilizationRate}%</p>
                            </div>
                            <div className="utilization-bar">
                              <div
                                className="utilization-fill"
                                style={{ width: `${utilizationRate}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Fund Tracking Table */}
            <div className="fund-tracking-table">
              <h3>Detailed Fund Tracking by Project</h3>
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Project Name</th>
                      <th>Agency</th>
                      <th>Budget Allocated</th>
                      <th>Budget Utilized</th>
                      <th>Utilization %</th>
                      <th>Status</th>
                      <th>Approval Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map(project => {
                      const utilizationPercent = project.budget_allocated > 0
                        ? Math.round((project.budget_utilized / project.budget_allocated) * 100)
                        : 0;

                      return (
                        <tr key={project.id}>
                          <td>
                            <strong>{project.name}</strong>
                            <div className="project-description">{project.description}</div>
                          </td>
                          <td>{project.agency_name || 'Unassigned'}</td>
                          <td>{formatCurrency(project.budget_allocated)}</td>
                          <td>{formatCurrency(project.budget_utilized)}</td>
                          <td>
                            <div className="utilization-cell">
                              <span>{utilizationPercent}%</span>
                              <div className="mini-bar">
                                <div
                                  className="mini-fill"
                                  style={{ width: `${utilizationPercent}%` }}
                                ></div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className={getStatusBadge(project.status)}>{project.status}</span>
                          </td>
                          <td>
                            <span className={project.approval_status === 'Approved' ? 'badge badge-success' : 'badge badge-warning'}>
                              {project.approval_status || 'Pending'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'approvals' && (
          <div className="approvals-section">
            <h2 className="section-title">Pending Fund Approvals</h2>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Project Name</th>
                    <th>State</th>
                    <th>Type</th>
                    <th>Requested Amount</th>
                    <th>Current Status</th>
                    <th>Priority</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.filter(p => p.approval_status === 'Pending' || !p.approval_status).map(project => (
                    <tr key={project.id}>
                      <td>
                        <strong>{project.name}</strong>
                        <div className="project-description">{project.description}</div>
                      </td>
                      <td>{project.state}</td>
                      <td>
                        <span className="project-type">{project.type}</span>
                      </td>
                      <td>{formatCurrency(project.budget_allocated)}</td>
                      <td>
                        <span className={project.approval_status === 'Pending' ? 'badge badge-warning' : 'badge badge-danger'}>
                          {project.approval_status || 'Not Submitted'}
                        </span>
                      </td>
                      <td>
                        <span className="badge badge-info">High</span>
                      </td>
                      <td>
                        <button 
                          className="btn btn-success btn-sm"
                          onClick={() => approveFunds(project.id, project.budget_allocated)}
                          title="Approve Project Funding"
                        >
                          ✓ Approve
                        </button>
                        <button 
                          className="btn btn-secondary btn-sm"
                          onClick={() => alert('Project review functionality coming soon!')}
                          title="Review Project Details"
                          style={{marginLeft: '8px'}}
                        >
                          📋 Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {projects.filter(p => p.approval_status === 'Pending' || !p.approval_status).length === 0 && (
                <div className="empty-state">
                  <h3>✅ All Projects Approved</h3>
                  <p>There are no pending fund approval requests at this time.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'agencies' && (
          <div className="agencies-section">
            <h2 className="section-title">Implementing Agencies</h2>
            <div className="agencies-grid">
              {agencies.map(agency => (
                <div key={agency.id} className="agency-card card">
                  <div className="card-header">
                    <h3>{agency.name}</h3>
                  </div>
                  <div className="card-body">
                    <div className="agency-info">
                      <p><strong>Type:</strong> {agency.type}</p>
                      <p><strong>Contact:</strong> {agency.contact_person}</p>
                      <p><strong>Email:</strong> {agency.email}</p>
                      <p><strong>Phone:</strong> {agency.phone}</p>
                      <p><strong>License:</strong> {agency.license_no}</p>
                    </div>
                    <div className="agency-stats">
                      <div className="stat">
                        <span className="stat-value">{agency.assignedProjectsCount}</span>
                        <span className="stat-label">Assigned Projects</span>
                      </div>
                      <div className="stat">
                        <span className="stat-value">{agency.completedProjectsCount}</span>
                        <span className="stat-label">Completed Projects</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CentralMinistryDashboard;