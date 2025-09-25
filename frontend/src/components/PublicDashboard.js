import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

const PublicDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [projects, setProjects] = useState([]);
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchPublicData();
  }, []);

  const fetchPublicData = async () => {
    try {
      setLoading(true);
      const [summaryRes, projectsRes, agenciesRes] = await Promise.all([
        axios.get('/api/public/summary'),
        axios.get('/api/public/projects'),
        axios.get('/api/public/agencies')
      ]);

      setSummary(summaryRes.data);
      setProjects(projectsRes.data);
      setAgencies(agenciesRes.data);
    } catch (error) {
      console.error('Error fetching public data:', error);
      alert('Public Data will be loaded here from database in future.');
    } finally {
      setLoading(false);
    }
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

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-spinner"></div>
        <p>Loading public dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container fade-in">
      <div className="dashboard-header">
        <h1 className="dashboard-title">PM-AJAY Public Dashboard</h1>
        <p className="dashboard-subtitle">Track Project Progress & Transparency</p>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="summary-section">
          <h2 className="section-title">Project Overview</h2>
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
              <div className="summary-icon">🎯</div>
              <div className="summary-content">
                <h3>{summary.inProgressProjects}</h3>
                <p>Projects In Progress</p>
              </div>
            </div>
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
          className={`tab-btn ${activeTab === 'agencies' ? 'active' : ''}`}
          onClick={() => setActiveTab('agencies')}
        >
          Implementing Agencies
        </button>
        <button
          className={`tab-btn ${activeTab === 'transparency' ? 'active' : ''}`}
          onClick={() => setActiveTab('transparency')}
        >
          Transparency Report
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
                    <th>Progress</th>
                    <th>Status</th>
                    <th>Expected Completion</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map(project => (
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
                      <td>{project.expected_completion || 'TBD'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'transparency' && (
          <div className="transparency-section">
            <h2 className="section-title">Transparency & Accountability</h2>
            <div className="transparency-content">
              <div className="transparency-card">
                <h3>📊 Project Tracking</h3>
                <p>All projects are tracked with real-time progress updates, ensuring complete transparency in implementation.</p>
              </div>
              <div className="transparency-card">
                <h3>💰 Fund Utilization</h3>
                <p>Public monitoring of fund allocation and utilization across all PM-AJAY components.</p>
              </div>
              <div className="transparency-card">
                <h3>🏢 Agency Oversight</h3>
                <p>Complete information about implementing agencies and their responsibilities.</p>
              </div>
              <div className="transparency-card">
                <h3>📅 Timeline Monitoring</h3>
                <p>Regular updates on project timelines and milestone achievements.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicDashboard;
