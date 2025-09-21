import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { mockProjects } from '../services/mockData';
import './Dashboard.css';
import './DashboardExtensions.css';

const VillageCommitteeDashboard = ({ user }) => {
  const [summary, setSummary] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('village');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // Use mock data directly for demo purposes
    setLoading(true);
    setTimeout(() => {
      // Filter projects for the user's village
      const villageProjects = mockProjects.filter(p => p.village === user.village);
      const completedProjects = villageProjects.filter(p => p.status === 'Completed' || p.progress_percentage >= 100).length;
      const totalBudget = villageProjects.reduce((sum, p) => sum + p.budget_allocated, 0);

      const villageSummary = {
        villageProjects: villageProjects.length,
        completedProjects: completedProjects,
        inProgressProjects: villageProjects.length - completedProjects,
        budgetAllocated: totalBudget,
        averageProgress: villageProjects.length > 0 ? Math.round(villageProjects.reduce((sum, p) => sum + p.progress_percentage, 0) / villageProjects.length) : 0
      };

      setSummary(villageSummary);
      setProjects(villageProjects);
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

  const submitVillageNeeds = async (e) => {
    e.preventDefault();
    // Mock submission - just show success message
    setTimeout(() => {
      alert('Village needs assessment submitted successfully! (Demo Mode)');
      e.target.reset();
    }, 500);
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
        <h1 className="dashboard-title">Village Committee Dashboard</h1>
        <p className="dashboard-subtitle">Village-level Development & Monitoring</p>
      </div>

      <div className="village-info">
        <h2>🏘️ {user.village} Village</h2>
        <p>{user.block} Block, {user.district} District, {user.state} State</p>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="summary-section">
          <h2 className="section-title">Village Development Summary</h2>
          <div className="summary-grid">
            <div className="summary-card">
              <div className="summary-icon">🏠</div>
              <div className="summary-content">
                <h3>{summary.villageProjects}</h3>
                <p>Village Projects</p>
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
              <div className="summary-icon">🚧</div>
              <div className="summary-content">
                <h3>{summary.inProgressProjects}</h3>
                <p>In Progress</p>
              </div>
            </div>
            <div className="summary-card">
              <div className="summary-icon">💰</div>
              <div className="summary-content">
                <h3>{formatCurrency(summary.budgetAllocated)}</h3>
                <p>Budget Allocated</p>
              </div>
            </div>
            <div className="summary-card">
              <div className="summary-icon">📊</div>
              <div className="summary-content">
                <h3>{summary.averageProgress}%</h3>
                <p>Average Progress</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="tab-navigation">
        <button 
          className={`tab-btn ${activeTab === 'village' ? 'active' : ''}`}
          onClick={() => setActiveTab('village')}
        >
          Village Projects
        </button>
        <button 
          className={`tab-btn ${activeTab === 'needs' ? 'active' : ''}`}
          onClick={() => setActiveTab('needs')}
        >
          Submit Needs Assessment
        </button>
        <button 
          className={`tab-btn ${activeTab === 'feedback' ? 'active' : ''}`}
          onClick={() => setActiveTab('feedback')}
        >
          Provide Feedback
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'village' && (
          <div className="village-projects">
            <h2 className="section-title">Projects in {user.village} Village</h2>
            {projects.length > 0 ? (
              <div className="projects-grid">
                {projects.map(project => (
                  <div key={project.id} className="project-card card">
                    <div className="card-header">
                      <h3>{project.name}</h3>
                      <span className={getStatusBadge(project.status)}>{project.status}</span>
                    </div>
                    <div className="card-body">
                      <p className="project-description">{project.description}</p>
                      
                      <div className="project-details">
                        <div className="detail-item">
                          <strong>Type:</strong> <span className="project-type">{project.type}</span>
                        </div>
                        <div className="detail-item">
                          <strong>Budget:</strong> {formatCurrency(project.budget_allocated)}
                        </div>
                        <div className="detail-item">
                          <strong>Start Date:</strong> {new Date(project.start_date).toLocaleDateString('en-IN')}
                        </div>
                        <div className="detail-item">
                          <strong>Expected Completion:</strong> {new Date(project.expected_completion).toLocaleDateString('en-IN')}
                        </div>
                      </div>

                      <div className="progress-section">
                        <div className="progress-header">
                          <span>Progress: {project.progress_percentage}%</span>
                        </div>
                        <div className="progress">
                          <div 
                            className={`progress-bar ${getProgressBarClass(project.progress_percentage)}`}
                            style={{ width: `${project.progress_percentage}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="milestones">
                        <h4>Project Milestones:</h4>
                        <div className="milestones-list">
                          {project.milestones.map((milestone, index) => (
                            <div key={index} className={`milestone ${milestone.status.toLowerCase()}`}>
                              <span className="milestone-phase">{milestone.phase}</span>
                              <span className="milestone-status">{milestone.status}</span>
                              <span className="milestone-date">{new Date(milestone.date).toLocaleDateString('en-IN')}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-projects">
                <div className="empty-state">
                  <h3>📋 No Projects Yet</h3>
                  <p>No development projects have been allocated to {user.village} village at this time.</p>
                  <p>You can submit needs assessments to help prioritize future projects.</p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'needs' && (
          <div className="needs-section">
            <h2 className="section-title">Village Needs Assessment</h2>
            <div className="needs-form">
              <h3>📝 Submit Village Development Needs</h3>
              <p className="text-secondary mb-3">
                Help us understand the priority development needs of {user.village} village. 
                Your input will be considered for future project planning.
              </p>
              
              <form onSubmit={submitVillageNeeds}>
                <div className="form-group">
                  <label className="form-label">Primary Development Need</label>
                  <select name="needs" className="form-control form-select" required>
                    <option value="">Select primary need</option>
                    <option value="Water Supply">Clean Water Supply</option>
                    <option value="Sanitation">Sanitation Facilities</option>
                    <option value="Roads">Road Infrastructure</option>
                    <option value="Electricity">Electricity Connection</option>
                    <option value="Healthcare">Healthcare Facilities</option>
                    <option value="Education">Educational Infrastructure</option>
                    <option value="Skill Training">Skill Development Programs</option>
                    <option value="Agriculture">Agricultural Support</option>
                    <option value="Digital">Digital Infrastructure</option>
                    <option value="Housing">Housing Assistance</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Detailed Description</label>
                  <textarea 
                    name="description"
                    className="form-control message-textarea" 
                    placeholder="Please provide detailed information about the need, current situation, and expected benefits..."
                    required
                  ></textarea>
                </div>

                <div className="row">
                  <div className="col-6">
                    <div className="form-group">
                      <label className="form-label">Priority Level</label>
                      <select name="priority" className="form-control form-select" required>
                        <option value="">Select priority</option>
                        <option value="Critical">Critical - Immediate Need</option>
                        <option value="High">High - Important</option>
                        <option value="Medium">Medium - Can Wait</option>
                        <option value="Low">Low - Future Planning</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="form-group">
                      <label className="form-label">Estimated Beneficiaries</label>
                      <input 
                        type="number" 
                        name="beneficiaries"
                        className="form-control" 
                        placeholder="Number of people who will benefit"
                      />
                    </div>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary">
                  📤 Submit Needs Assessment
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'feedback' && (
          <div className="feedback-section">
            <h2 className="section-title">Project Feedback</h2>
            <div className="feedback-form needs-form">
              <h3>💬 Provide Project Feedback</h3>
              <p className="text-secondary mb-3">
                Share your observations and feedback about ongoing or completed projects in {user.village}.
              </p>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                // Mock submission - just show success message
                setTimeout(() => {
                  alert('Feedback submitted successfully! Thank you for your input. (Demo Mode)');
                  e.target.reset();
                }, 500);
              }}>
                <div className="form-group">
                  <label className="form-label">Select Project</label>
                  <select name="project_id" className="form-control form-select" required>
                    <option value="">Select a project to provide feedback</option>
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>{project.name}</option>
                    ))}
                    <option value="general">General Feedback</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Feedback Type</label>
                  <select name="feedback_type" className="form-control form-select" required>
                    <option value="">Select feedback type</option>
                    <option value="Quality">Work Quality</option>
                    <option value="Timeline">Timeline/Progress</option>
                    <option value="Communication">Communication Issues</option>
                    <option value="Benefits">Community Benefits</option>
                    <option value="Suggestion">Suggestions</option>
                    <option value="Complaint">Complaint</option>
                    <option value="Appreciation">Appreciation</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Your Feedback</label>
                  <textarea 
                    name="feedback_content"
                    className="form-control message-textarea" 
                    placeholder="Please share your detailed feedback, observations, or suggestions..."
                    required
                  ></textarea>
                </div>

                <div className="form-group">
                  <label className="form-label">Rating (Optional)</label>
                  <select name="rating" className="form-control form-select">
                    <option value="">Select rating</option>
                    <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
                    <option value="4">⭐⭐⭐⭐ Good</option>
                    <option value="3">⭐⭐⭐ Average</option>
                    <option value="2">⭐⭐ Poor</option>
                    <option value="1">⭐ Very Poor</option>
                  </select>
                </div>

                <button type="submit" className="btn btn-primary">
                  📝 Submit Feedback
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VillageCommitteeDashboard;