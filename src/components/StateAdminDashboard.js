import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { mockPublicSummary, mockProjects } from '../services/mockData';
import './Dashboard.css';
import './DashboardExtensions.css';

const StateAdminDashboard = ({ user }) => {
  const [summary, setSummary] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Project Task Management state
  const storageKey = `state_tasks_${user?.state || 'default'}_${user?.district || 'all'}`;
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Load tasks from localStorage on mount or when user changes
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setTasks(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Could not load saved tasks', e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  useEffect(() => {
    // Persist tasks to localStorage
    try {
      localStorage.setItem(storageKey, JSON.stringify(tasks));
    } catch (e) {
      console.warn('Could not save tasks', e);
    }
  }, [tasks, storageKey]);

  const fetchData = async () => {
    // Use mock data directly for demo purposes
    setLoading(true);
    setTimeout(() => {
      // Filter projects for the user's state
      const stateProjects = mockProjects.filter(p => p.state === user.state);
      const completedProjects = stateProjects.filter(p => p.status === 'Completed' || p.progress_percentage >= 100).length;
      const totalBudget = stateProjects.reduce((sum, p) => sum + p.budget_allocated, 0);
      const utilizedBudget = stateProjects.reduce((sum, p) => sum + p.budget_utilized, 0);

      const stateSummary = {
        stateProjects: stateProjects.length,
        completedProjects: completedProjects,
        inProgressProjects: stateProjects.length - completedProjects,
        budgetAllocated: totalBudget,
        budgetUtilized: utilizedBudget,
        budgetUtilizationPercent: totalBudget > 0 ? Math.round((utilizedBudget / totalBudget) * 100) : 0,
        averageProgress: stateProjects.length > 0 ? Math.round(stateProjects.reduce((sum, p) => sum + p.progress_percentage, 0) / stateProjects.length) : 0
      };

      setSummary(stateSummary);
      setProjects(stateProjects);
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
      case 'Ready':
        return 'badge badge-primary';
      case 'Blocked':
        return 'badge badge-danger';
      default:
        return 'badge badge-secondary';
    }
  };

  const groupProjectsByDistrict = () => {
    const grouped = {};
    projects.forEach(project => {
      if (!grouped[project.district]) {
        grouped[project.district] = [];
      }
      grouped[project.district].push(project);
    });
    return grouped;
  };

  // Task helpers
  const agencies = [
    'PWD',
    'Water Supply',
    'Skill Development Agency',
    'Education Department',
    'Rural Development'
  ];

  const computeTaskStatus = (task, all) => {
    if (task.completed) return 'Completed';
    if (!task.dependsOn || task.dependsOn.length === 0) return 'Ready';
    const depDone = task.dependsOn.every(id => (all.find(t => t.id === id) || {}).completed);
    return depDone ? 'Ready' : 'Blocked';
  };

  const addTask = () => {
    const id = Date.now();
    setTasks(prev => ([
      ...prev,
      { id, name: `Task ${prev.length + 1}`, agency: '', dueDate: '', dependsOn: [], completed: false }
    ]));
  };

  const updateTask = (id, patch) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...patch } : t));
  };

  const toggleComplete = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const resetTasks = () => {
    if (window.confirm('Reset all tasks? This cannot be undone.')) {
      setTasks([]);
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

  const projectsByDistrict = groupProjectsByDistrict();

  return (
    <div className="dashboard-container fade-in">
      <div className="dashboard-header">
        <h1 className="dashboard-title">State Admin Dashboard</h1>
        <p className="dashboard-subtitle">State-level Project Coordination & Management</p>
        <div className="state-info">
          <h3>🏛️ {user.state} State</h3>
          <p>District: {user.district}</p>
        </div>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="summary-section">
          <h2 className="section-title">State Summary - {user.state}</h2>
          <div className="summary-grid">
            <div className="summary-card">
              <div className="summary-icon">📊</div>
              <div className="summary-content">
                <h3>{summary.stateProjects}</h3>
                <p>State Projects</p>
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
              <div className="summary-icon">📈</div>
              <div className="summary-content">
                <h3>{summary.budgetUtilizationPercent}%</h3>
                <p>Budget Utilization</p>
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

      {/* Navigation Tabs */}
      <div className="tab-navigation">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          State Overview
        </button>
        <button 
          className={`tab-btn ${activeTab === 'districts' ? 'active' : ''}`}
          onClick={() => setActiveTab('districts')}
        >
          District-wise Projects
        </button>
        <button 
          className={`tab-btn ${activeTab === 'tasks' ? 'active' : ''}`}
          onClick={() => setActiveTab('tasks')}
        >
          Project Task Management
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'overview' && (
          <div className="state-projects">
            <h2 className="section-title">All State Projects</h2>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Project Name</th>
                    <th>District</th>
                    <th>Village</th>
                    <th>Type</th>
                    <th>Budget</th>
                    <th>Utilized</th>
                    <th>Progress</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map(project => (
                    <tr key={project.id}>
                      <td>
                        <strong>{project.name}</strong>
                        <div className="project-description">{project.description}</div>
                      </td>
                      <td>{project.district}</td>
                      <td>{project.village}</td>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'districts' && (
          <div className="districts-section">
            <h2 className="section-title">District-wise Project Distribution</h2>
            {Object.entries(projectsByDistrict).map(([district, districtProjects]) => (
              <div key={district} className="district-card card mb-3">
                <div className="card-header">
                  <h3>📍 {district} District</h3>
                  <span className="text-secondary">{districtProjects.length} Projects</span>
                </div>
                <div className="card-body">
                  <div className="row">
                    {districtProjects.map(project => (
                      <div key={project.id} className="col-4">
                        <div className="project-summary-card">
                          <h4>{project.name}</h4>
                          <p className="text-secondary">{project.village}</p>
                          <div className="project-stats">
                            <div className="stat">
                              <span className="stat-label">Budget:</span>
                              <span className="stat-value">{formatCurrency(project.budget_allocated)}</span>
                            </div>
                            <div className="stat">
                              <span className="stat-label">Progress:</span>
                              <span className="stat-value">{project.progress_percentage}%</span>
                            </div>
                            <div className="progress">
                              <div 
                                className={`progress-bar ${getProgressBarClass(project.progress_percentage)}`}
                                style={{ width: `${project.progress_percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="tasks-section">
            <div className="section-header with-actions">
              <h2 className="section-title">Project Task Management</h2>
              <div className="actions">
                <button className="btn btn-primary" onClick={addTask}>➕ Add Task</button>
                <button className="btn btn-secondary" onClick={resetTasks}>♻️ Reset</button>
              </div>
            </div>

            {tasks.length === 0 ? (
              <div className="empty-state card">
                <div className="card-body">
                  <p>No tasks yet. Click "Add Task" to get started.</p>
                </div>
              </div>
            ) : (
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Task Name</th>
                      <th>Agency</th>
                      <th>Due Date</th>
                      <th>Depends On</th>
                      <th>Status</th>
                      <th>Done</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map((t, idx) => {
                      const status = computeTaskStatus(t, tasks);
                      return (
                        <tr key={t.id}>
                          <td>{idx + 1}</td>
                          <td>
                            <input
                              className="form-control"
                              value={t.name}
                              onChange={(e) => updateTask(t.id, { name: e.target.value })}
                              placeholder="Enter task name"
                            />
                          </td>
                          <td>
                            <select
                              className="form-control form-select"
                              value={t.agency}
                              onChange={(e) => updateTask(t.id, { agency: e.target.value })}
                            >
                              <option value="">Select agency</option>
                              {agencies.map(a => (
                                <option key={a} value={a}>{a}</option>
                              ))}
                            </select>
                          </td>
                          <td>
                            <input
                              type="date"
                              className="form-control"
                              value={t.dueDate}
                              onChange={(e) => updateTask(t.id, { dueDate: e.target.value })}
                            />
                          </td>
                          <td>
                            <select
                              className="form-control form-select"
                              multiple
                              value={t.dependsOn}
                              onChange={(e) => {
                                const selected = Array.from(e.target.selectedOptions)
                                  .map(o => o.value === 'none' ? null : Number(o.value))
                                  .filter(v => v !== null);
                                updateTask(t.id, { dependsOn: selected });
                              }}
                            >
                              <option value="none" style={{fontStyle: 'italic', color: '#666'}}>None (No Dependencies)</option>
                              {tasks.filter(x => x.id !== t.id).map(x => (
                                <option key={x.id} value={x.id}>{x.name}</option>
                              ))}
                            </select>
                          </td>
                          <td>
                            <span className={getStatusBadge(status)}>{status}</span>
                          </td>
                          <td>
                            <input
                              type="checkbox"
                              checked={!!t.completed}
                              onChange={() => {
                                const st = computeTaskStatus(t, tasks);
                                if (st === 'Blocked') {
                                  alert('This task is blocked by dependencies. Complete dependencies first.');
                                  return;
                                }
                                toggleComplete(t.id);
                              }}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StateAdminDashboard;
