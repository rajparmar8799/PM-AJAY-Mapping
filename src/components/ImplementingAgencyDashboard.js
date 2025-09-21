import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { mockProjects, mockProposals, mockForumMessages, mockProgressHistory } from '../services/mockData';
import './Dashboard.css';

const ImplementingAgencyDashboard = ({ user }) => {
  const [summary, setSummary] = useState(null);
  const [projects, setProjects] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [forumMessages, setForumMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('projects');
  const [newMessage, setNewMessage] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [progressHistory, setProgressHistory] = useState([]);
  const [updateForm, setUpdateForm] = useState({
    projectId: '',
    progress: 0,
    status: '',
    milestone: '',
    notes: '',
    issues: '',
    nextSteps: '',
    expectedCompletion: '',
    filesUploaded: []
  });
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [reviewForm, setReviewForm] = useState({
    status: 'Under Review',
    review_comments: ''
  });
  const [acceptForm, setAcceptForm] = useState({
    start_date: '',
    expected_completion: '',
    implementation_plan: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // Use mock data directly for demo purposes
    setLoading(true);
    setTimeout(() => {
      // Filter projects assigned to this agency
      const agencyProjects = mockProjects.filter(p => p.implementing_agency === user.id);
      const completedProjects = agencyProjects.filter(p => p.status === 'Completed' || p.progress_percentage >= 100).length;
      const totalBudget = agencyProjects.reduce((sum, p) => sum + p.budget_allocated, 0);

      const agencySummary = {
        assignedProjects: agencyProjects.length,
        completedProjects: completedProjects,
        inProgressProjects: agencyProjects.length - completedProjects,
        totalBudget: totalBudget,
        averageProgress: agencyProjects.length > 0 ? Math.round(agencyProjects.reduce((sum, p) => sum + p.progress_percentage, 0) / agencyProjects.length) : 0
      };

      // Filter proposals assigned to this agency
      const agencyProposals = mockProposals.filter(p => p.assigned_agency === user.id);

      setSummary(agencySummary);
      setProjects(agencyProjects);
      setProposals(agencyProposals);
      setForumMessages(mockForumMessages);
      setProgressHistory(mockProgressHistory);
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  const openUpdateModal = (project) => {
    setUpdateForm({
      projectId: project.id,
      progress: project.progress_percentage,
      status: project.status,
      milestone: '',
      notes: '',
      issues: '',
      nextSteps: '',
      expectedCompletion: project.expected_completion,
      filesUploaded: []
    });
    setShowUpdateModal(true);
  };

  const closeUpdateModal = () => {
    setShowUpdateModal(false);
    setUpdateForm({
      projectId: '',
      progress: 0,
      status: '',
      milestone: '',
      notes: '',
      issues: '',
      nextSteps: '',
      expectedCompletion: '',
      filesUploaded: []
    });
  };

  const handleFormChange = (field, value) => {
    setUpdateForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setUpdateForm(prev => ({
      ...prev,
      filesUploaded: [...prev.filesUploaded, ...files]
    }));
  };

  const removeFile = (index) => {
    setUpdateForm(prev => ({
      ...prev,
      filesUploaded: prev.filesUploaded.filter((_, i) => i !== index)
    }));
  };

  const submitProgressUpdate = async (e) => {
    e.preventDefault();

    // Mock submission - just show success message
    setTimeout(() => {
      closeUpdateModal();
      alert('Progress updated successfully! (Demo Mode)');
    }, 500);
  };

  const quickUpdateStatus = async (projectId, status, progress) => {
    // Mock update - just show success message
    setTimeout(() => {
      alert('Status updated successfully! (Demo Mode)');
    }, 300);
  };

  const postMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // Mock posting - just show success message
    setTimeout(() => {
      setNewMessage('');
      setSelectedProject('');
      alert('Message posted successfully! (Demo Mode)');
    }, 500);
  };

  // Proposal Review Functions
  const openReviewModal = (proposal) => {
    setSelectedProposal(proposal);
    setReviewForm({
      status: 'Under Review',
      review_comments: ''
    });
    setShowReviewModal(true);
  };

  const closeReviewModal = () => {
    setShowReviewModal(false);
    setSelectedProposal(null);
    setReviewForm({ status: 'Under Review', review_comments: '' });
  };

  const submitProposalReview = async (e) => {
    e.preventDefault();
    if (!selectedProposal) return;

    // Mock submission - just show success message
    setTimeout(() => {
      closeReviewModal();
      alert('Proposal review submitted successfully! (Demo Mode)');
    }, 500);
  };

  const openAcceptModal = (proposal) => {
    setSelectedProposal(proposal);
    const today = new Date().toISOString().split('T')[0];
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + 6); // Default 6 months completion
    
    setAcceptForm({
      start_date: today,
      expected_completion: futureDate.toISOString().split('T')[0],
      implementation_plan: ''
    });
    setShowAcceptModal(true);
  };

  const closeAcceptModal = () => {
    setShowAcceptModal(false);
    setSelectedProposal(null);
    setAcceptForm({ start_date: '', expected_completion: '', implementation_plan: '' });
  };

  const submitProposalAcceptance = async (e) => {
    e.preventDefault();
    if (!selectedProposal) return;

    // Mock submission - just show success message
    setTimeout(() => {
      closeAcceptModal();
      alert('Proposal accepted successfully! Project has been created. (Demo Mode)');
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
        <h1 className="dashboard-title">Implementing Agency Dashboard</h1>
        <p className="dashboard-subtitle">Project Execution & Progress Updates</p>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="summary-section">
          <h2 className="section-title">Project Summary</h2>
          <div className="summary-grid">
            <div className="summary-card">
              <div className="summary-icon">📋</div>
              <div className="summary-content">
                <h3>{summary.assignedProjects}</h3>
                <p>Assigned Projects</p>
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
                <h3>{formatCurrency(summary.totalBudget)}</h3>
                <p>Total Budget</p>
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
          className={`tab-btn ${activeTab === 'projects' ? 'active' : ''}`}
          onClick={() => setActiveTab('projects')}
        >
          My Projects
        </button>
        <button 
          className={`tab-btn ${activeTab === 'proposals' ? 'active' : ''}`}
          onClick={() => setActiveTab('proposals')}
        >
          Assigned Proposals
        </button>
        <button 
          className={`tab-btn ${activeTab === 'forum' ? 'active' : ''}`}
          onClick={() => setActiveTab('forum')}
        >
          Discussion Forum
        </button>
        <button 
          className={`tab-btn ${activeTab === 'update' ? 'active' : ''}`}
          onClick={() => setActiveTab('update')}
        >
          Update Progress
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'projects' && (
          <div className="projects-section">
            <h2 className="section-title">Assigned Projects</h2>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Project Name</th>
                    <th>Location</th>
                    <th>Type</th>
                    <th>Budget</th>
                    <th>Progress</th>
                    <th>Status</th>
                    <th>Deadline</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map(project => (
                    <tr key={project.id}>
                      <td>
                        <strong>{project.name}</strong>
                        <div className="project-description">{project.description}</div>
                      </td>
                      <td>{project.village}, {project.district}, {project.state}</td>
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
                      <td>{new Date(project.expected_completion).toLocaleDateString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'proposals' && (
          <div className="proposals-section">
            <h2 className="section-title">Assigned Project Proposals</h2>
            <div className="section-subtitle">
              Proposals assigned to your agency for review and project execution
            </div>
            
            {proposals.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📋</div>
                <h3>No Proposals Assigned</h3>
                <p>You currently have no proposals assigned to your agency. New proposals will appear here when assigned by the Central Ministry.</p>
              </div>
            ) : (
              <div className="proposals-grid">
                {proposals.map(proposal => (
                  <div key={proposal.id} className="proposal-card">
                    <div className="proposal-header">
                      <h3 className="proposal-title">{proposal.title}</h3>
                      <span className={`proposal-status ${proposal.status.toLowerCase().replace(' ', '-')}`}>
                        {proposal.status === 'Assigned' ? '📝' : 
                         proposal.status === 'Submitted' ? '📄' : 
                         proposal.status === 'Under Review' ? '🔍' :
                         proposal.status === 'Approved' ? '✅' :
                         proposal.status === 'Accepted' ? '🎉' :
                         proposal.status === 'Rejected' ? '❌' : '🔄'} {proposal.status}
                      </span>
                    </div>
                    
                    <div className="proposal-details">
                      <p className="proposal-description">{proposal.description}</p>
                      
                      <div className="proposal-meta">
                        <div className="meta-item">
                          <span className="meta-label">📍 Location:</span>
                          <span className="meta-value">
                            {proposal.village ? `${proposal.village}, ` : ''}{proposal.district}, {proposal.state}
                          </span>
                        </div>
                        
                        <div className="meta-item">
                          <span className="meta-label">🏷️ Type:</span>
                          <span className="meta-value project-type">{proposal.project_type}</span>
                        </div>
                        
                        <div className="meta-item">
                          <span className="meta-label">💰 Budget:</span>
                          <span className="meta-value">{formatCurrency(proposal.estimated_budget)}</span>
                        </div>
                        
                        <div className="meta-item">
                          <span className="meta-label">⏱️ Timeline:</span>
                          <span className="meta-value">{proposal.timeline}</span>
                        </div>
                        
                        <div className="meta-item">
                          <span className="meta-label">📊 Submitted by:</span>
                          <span className="meta-value">{proposal.submitted_by_name} ({proposal.submitter_state})</span>
                        </div>
                        
                        {proposal.assigned_date && (
                          <div className="meta-item">
                            <span className="meta-label">📅 Assigned on:</span>
                            <span className="meta-value">{formatDate(proposal.assigned_date)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="proposal-actions">
                      <button 
                        className="btn btn-primary btn-review"
                        onClick={() => openReviewModal(proposal)}
                        disabled={proposal.status === 'Accepted' || proposal.status === 'Rejected'}
                      >
                        📋 Review Proposal
                      </button>
                      <button 
                        className="btn btn-success btn-accept"
                        onClick={() => openAcceptModal(proposal)}
                        disabled={proposal.status === 'Accepted' || proposal.status === 'Rejected'}
                      >
                        ✅ Accept & Start Planning
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'forum' && (
          <div className="forum-section">
            <div className="forum-header">
              <h2>🗣️ Discussion Forum</h2>
              <span>Agency Communication Hub</span>
            </div>
            
            <div className="forum-posts">
              {forumMessages.map(message => (
                <div key={message.id} className="forum-post">
                  <div className="post-header">
                    <span className="post-author">{message.user_name}</span>
                    <span className="post-time">{formatDate(message.timestamp)}</span>
                  </div>
                  {message.project_id !== 'GENERAL' && (
                    <div className="post-project">Project: {message.project_id}</div>
                  )}
                  <div className="post-message">{message.message}</div>
                </div>
              ))}
            </div>

            <form onSubmit={postMessage} className="forum-form">
              <div className="form-row">
                <select
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  className="form-control form-select"
                >
                  <option value="">General Discussion</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>{project.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="form-control message-textarea"
                  placeholder="Share updates, ask questions, or discuss project progress..."
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary">
                📝 Post Message
              </button>
            </form>
          </div>
        )}

        {activeTab === 'update' && (
          <div className="update-section">
            <div className="section-header">
              <h2 className="section-title">📊 Project Progress Management</h2>
              <p className="section-subtitle">Update project progress, milestones, and report issues</p>
            </div>

            <div className="projects-grid">
              {projects.map(project => (
                <div key={project.id} className="project-update-card">
                  <div className="project-header">
                    <h3 className="project-name">{project.name}</h3>
                    <span className={`status-badge ${getStatusBadge(project.status).replace('badge ', '')}`}>
                      {project.status}
                    </span>
                  </div>
                  
                  <div className="project-info">
                    <p className="project-location">📍 {project.village}, {project.district}</p>
                    <p className="project-budget">💰 {formatCurrency(project.budget_allocated)}</p>
                    <p className="project-deadline">📅 Deadline: {new Date(project.expected_completion).toLocaleDateString('en-IN')}</p>
                  </div>

                  <div className="progress-display">
                    <div className="progress-info">
                      <span>Progress: <strong>{project.progress_percentage}%</strong></span>
                      <div className="progress">
                        <div 
                          className={`progress-bar ${getProgressBarClass(project.progress_percentage)}`}
                          style={{ width: `${project.progress_percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="milestone-tracker">
                    <h5>📈 Milestones</h5>
                    <div className="milestones">
                      {project.milestones && project.milestones.map((milestone, idx) => (
                        <div key={idx} className={`milestone ${milestone.status.toLowerCase().replace(' ', '-')}`}>
                          <span className="milestone-phase">{milestone.phase}</span>
                          <span className={`milestone-status ${milestone.status.toLowerCase().replace(' ', '-')}`}>
                            {milestone.status === 'Completed' ? '✅' : 
                             milestone.status === 'In Progress' ? '⏳' : '⏰'} {milestone.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="quick-actions">
                    <div className="form-group">
                      <label>Quick Progress Update:</label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={project.progress_percentage}
                        onChange={(e) => {
                          const newProgress = parseInt(e.target.value);
                          const newStatus = newProgress >= 100 ? 'Completed' : 
                                          newProgress >= 80 ? 'Near Completion' : 'In Progress';
                          quickUpdateStatus(project.id, newStatus, newProgress);
                        }}
                        className="range-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>Quick Status Change:</label>
                      <select
                        value={project.status}
                        onChange={(e) => quickUpdateStatus(project.id, e.target.value, project.progress_percentage)}
                        className="form-control form-select"
                      >
                        <option value="In Progress">In Progress</option>
                        <option value="Near Completion">Near Completion</option>
                        <option value="Completed">Completed</option>
                        <option value="On Hold">On Hold</option>
                        <option value="Delayed">Delayed</option>
                      </select>
                    </div>
                  </div>

                  <div className="update-actions">
                    <button 
                      className="btn btn-primary btn-detailed-update"
                      onClick={() => openUpdateModal(project)}
                    >
                      📝 Detailed Update
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Progress History Section */}
            <div className="progress-history-section">
              <h3>📋 Recent Progress Updates</h3>
              <div className="history-timeline">
                {progressHistory.slice(0, 10).map((update, idx) => (
                  <div key={idx} className="timeline-item">
                    <div className="timeline-marker"></div>
                    <div className="timeline-content">
                      <div className="timeline-header">
                        <strong>{projects.find(p => p.id === update.project_id)?.name || 'Unknown Project'}</strong>
                        <span className="timeline-date">{formatDate(update.update_date)}</span>
                      </div>
                      <div className="timeline-details">
                        <p>Progress: <strong>{update.progress_percentage}%</strong> • Status: <strong>{update.status}</strong></p>
                        {update.milestone && <p>🎯 Milestone: {update.milestone}</p>}
                        {update.notes && <p>📝 Notes: {update.notes}</p>}
                        {update.issues && <p>⚠️ Issues: {update.issues}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Detailed Update Modal */}
      {showUpdateModal && (
        <div className="modal-overlay">
          <div className="modal-content update-modal">
            <div className="modal-header">
              <h3>📊 Detailed Progress Update</h3>
              <button className="modal-close" onClick={closeUpdateModal}>&times;</button>
            </div>
            
            <form onSubmit={submitProgressUpdate} className="update-form-detailed">
              <div className="form-row">
                <div className="form-group col-6">
                  <label className="form-label">Project Progress (%)</label>
                  <div className="progress-input-container">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={updateForm.progress}
                      onChange={(e) => handleFormChange('progress', e.target.value)}
                      className="range-input"
                    />
                    <span className="range-value">{updateForm.progress}%</span>
                  </div>
                  <div className="progress">
                    <div 
                      className={`progress-bar ${getProgressBarClass(updateForm.progress)}`}
                      style={{ width: `${updateForm.progress}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="form-group col-6">
                  <label className="form-label">Project Status</label>
                  <select
                    value={updateForm.status}
                    onChange={(e) => handleFormChange('status', e.target.value)}
                    className="form-control form-select"
                    required
                  >
                    <option value="In Progress">In Progress</option>
                    <option value="Near Completion">Near Completion</option>
                    <option value="Completed">Completed</option>
                    <option value="On Hold">On Hold</option>
                    <option value="Delayed">Delayed</option>
                    <option value="Under Review">Under Review</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group col-6">
                  <label className="form-label">Current Milestone</label>
                  <input
                    type="text"
                    value={updateForm.milestone}
                    onChange={(e) => handleFormChange('milestone', e.target.value)}
                    className="form-control"
                    placeholder="e.g., Foundation work completed"
                  />
                </div>
                
                <div className="form-group col-6">
                  <label className="form-label">Expected Completion</label>
                  <input
                    type="date"
                    value={updateForm.expectedCompletion ? updateForm.expectedCompletion.split('T')[0] : ''}
                    onChange={(e) => handleFormChange('expectedCompletion', e.target.value)}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Progress Notes & Details</label>
                <textarea
                  value={updateForm.notes}
                  onChange={(e) => handleFormChange('notes', e.target.value)}
                  className="form-control"
                  rows="4"
                  placeholder="Describe the current progress, work completed, achievements..."
                />
              </div>

              <div className="form-group">
                <label className="form-label">Issues & Challenges (if any)</label>
                <textarea
                  value={updateForm.issues}
                  onChange={(e) => handleFormChange('issues', e.target.value)}
                  className="form-control"
                  rows="3"
                  placeholder="Mention any delays, resource constraints, technical issues..."
                />
              </div>

              <div className="form-group">
                <label className="form-label">Next Steps & Action Plan</label>
                <textarea
                  value={updateForm.nextSteps}
                  onChange={(e) => handleFormChange('nextSteps', e.target.value)}
                  className="form-control"
                  rows="3"
                  placeholder="Outline the next phase of work, upcoming milestones..."
                />
              </div>

              <div className="form-group">
                <label className="form-label">Upload Files (Photos, Reports, Documents)</label>
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="form-control"
                  accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                />
                <small className="form-text">Upload progress photos, reports, or supporting documents</small>
                
                {updateForm.filesUploaded.length > 0 && (
                  <div className="uploaded-files">
                    <h6>Uploaded Files:</h6>
                    {updateForm.filesUploaded.map((file, idx) => (
                      <div key={idx} className="file-item">
                        <span className="file-name">📎 {file.name}</span>
                        <button 
                          type="button" 
                          className="btn-remove-file"
                          onClick={() => removeFile(idx)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeUpdateModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-success">
                  📤 Submit Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Proposal Review Modal */}
      {showReviewModal && selectedProposal && (
        <div className="modal-overlay">
          <div className="modal-content update-modal">
            <div className="modal-header">
              <h3>📋 Review Proposal</h3>
              <button className="modal-close" onClick={closeReviewModal}>&times;</button>
            </div>
            
            <div className="modal-body" style={{ padding: '24px' }}>
              <div className="proposal-summary">
                <h4>{selectedProposal.title}</h4>
                <p><strong>Type:</strong> {selectedProposal.project_type}</p>
                <p><strong>Location:</strong> {selectedProposal.village ? `${selectedProposal.village}, ` : ''}{selectedProposal.district}, {selectedProposal.state}</p>
                <p><strong>Budget:</strong> {formatCurrency(selectedProposal.estimated_budget)}</p>
                <p><strong>Timeline:</strong> {selectedProposal.timeline}</p>
                <p><strong>Description:</strong> {selectedProposal.description}</p>
              </div>
              
              <form onSubmit={submitProposalReview}>
                <div className="form-group">
                  <label className="form-label">Review Status</label>
                  <select
                    value={reviewForm.status}
                    onChange={(e) => setReviewForm(prev => ({ ...prev, status: e.target.value }))}
                    className="form-control form-select"
                    required
                  >
                    <option value="Under Review">Under Review</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Review Comments</label>
                  <textarea
                    value={reviewForm.review_comments}
                    onChange={(e) => setReviewForm(prev => ({ ...prev, review_comments: e.target.value }))}
                    className="form-control"
                    rows="4"
                    placeholder="Provide your assessment of this proposal..."
                  />
                </div>
                
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={closeReviewModal}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    📤 Submit Review
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Proposal Accept Modal */}
      {showAcceptModal && selectedProposal && (
        <div className="modal-overlay">
          <div className="modal-content update-modal">
            <div className="modal-header">
              <h3>✅ Accept Proposal & Start Planning</h3>
              <button className="modal-close" onClick={closeAcceptModal}>&times;</button>
            </div>
            
            <div className="modal-body" style={{ padding: '24px' }}>
              <div className="proposal-summary">
                <h4>{selectedProposal.title}</h4>
                <p><strong>Budget:</strong> {formatCurrency(selectedProposal.estimated_budget)}</p>
                <p><strong>Expected Timeline:</strong> {selectedProposal.timeline}</p>
              </div>
              
              <form onSubmit={submitProposalAcceptance}>
                <div className="form-row">
                  <div className="form-group col-6">
                    <label className="form-label">Project Start Date</label>
                    <input
                      type="date"
                      value={acceptForm.start_date}
                      onChange={(e) => setAcceptForm(prev => ({ ...prev, start_date: e.target.value }))}
                      className="form-control"
                      required
                    />
                  </div>
                  
                  <div className="form-group col-6">
                    <label className="form-label">Expected Completion</label>
                    <input
                      type="date"
                      value={acceptForm.expected_completion}
                      onChange={(e) => setAcceptForm(prev => ({ ...prev, expected_completion: e.target.value }))}
                      className="form-control"
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Implementation Plan</label>
                  <textarea
                    value={acceptForm.implementation_plan}
                    onChange={(e) => setAcceptForm(prev => ({ ...prev, implementation_plan: e.target.value }))}
                    className="form-control"
                    rows="5"
                    placeholder="Outline your implementation approach, key phases, resource requirements, and project execution strategy..."
                  />
                </div>
                
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={closeAcceptModal}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-success">
                    🚀 Accept & Create Project
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImplementingAgencyDashboard;
