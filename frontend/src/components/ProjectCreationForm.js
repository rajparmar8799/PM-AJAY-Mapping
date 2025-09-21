import React, { useState } from 'react';
import api from '../services/api';
import './ProjectCreationForm.css';

const ProjectCreationForm = ({ user, onClose, onProjectCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: '',
    district: '',
    village: '',
    budget_allocated: '',
    timeline: '',
    objectives: '',
    expected_beneficiaries: '',
    implementation_strategy: '',
    monitoring_plan: '',
    risk_assessment: '',
    sustainability_plan: ''
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const projectTypes = [
    'Adarsh Gram',
    'GIA',
    'Hostel',
    'Infrastructure',
    'Training',
    'Healthcare',
    'Education',
    'Agriculture',
    'Water Management',
    'Sanitation'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Project name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.type) newErrors.type = 'Project type is required';
    if (!formData.district.trim()) newErrors.district = 'District is required';
    if (!formData.village.trim()) newErrors.village = 'Village is required';
    if (!formData.budget_allocated || formData.budget_allocated <= 0) {
      newErrors.budget_allocated = 'Valid budget amount is required';
    }
    if (!formData.timeline.trim()) newErrors.timeline = 'Timeline is required';
    if (!formData.objectives.trim()) newErrors.objectives = 'Objectives are required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const projectData = {
        ...formData,
        state: user.state,
        submitted_by: user.id,
        status: 'Pending Approval',
        budget_allocated: parseFloat(formData.budget_allocated)
      };

      const response = await api.post('/api/projects/create', projectData);

      if (onProjectCreated) {
        onProjectCreated(response.data.project);
      }

      alert('Project submitted successfully! It will be reviewed by the Central Ministry.');
      onClose();

    } catch (error) {
      console.error('Error creating project:', error);
      alert('Error creating project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="project-form-overlay">
      <div className="project-form-container">
        <div className="project-form-header">
          <h2>Create New Project</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="project-form">
          <div className="form-section">
            <h3>Basic Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="name">Project Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={errors.name ? 'error' : ''}
                  placeholder="Enter project name"
                />
                {errors.name && <span className="error-text">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="type">Project Type *</label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className={errors.type ? 'error' : ''}
                >
                  <option value="">Select project type</option>
                  {projectTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {errors.type && <span className="error-text">{errors.type}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="district">District *</label>
                <input
                  type="text"
                  id="district"
                  name="district"
                  value={formData.district}
                  onChange={handleInputChange}
                  className={errors.district ? 'error' : ''}
                  placeholder="Enter district name"
                />
                {errors.district && <span className="error-text">{errors.district}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="village">Village *</label>
                <input
                  type="text"
                  id="village"
                  name="village"
                  value={formData.village}
                  onChange={handleInputChange}
                  className={errors.village ? 'error' : ''}
                  placeholder="Enter village name"
                />
                {errors.village && <span className="error-text">{errors.village}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="budget_allocated">Budget Allocated (₹) *</label>
                <input
                  type="number"
                  id="budget_allocated"
                  name="budget_allocated"
                  value={formData.budget_allocated}
                  onChange={handleInputChange}
                  className={errors.budget_allocated ? 'error' : ''}
                  placeholder="Enter budget amount"
                  min="0"
                  step="1000"
                />
                {errors.budget_allocated && <span className="error-text">{errors.budget_allocated}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="timeline">Timeline *</label>
                <input
                  type="text"
                  id="timeline"
                  name="timeline"
                  value={formData.timeline}
                  onChange={handleInputChange}
                  className={errors.timeline ? 'error' : ''}
                  placeholder="e.g., 12 months, 18 months"
                />
                {errors.timeline && <span className="error-text">{errors.timeline}</span>}
              </div>
            </div>

            <div className="form-group full-width">
              <label htmlFor="description">Project Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className={errors.description ? 'error' : ''}
                placeholder="Provide detailed description of the project"
                rows="4"
              />
              {errors.description && <span className="error-text">{errors.description}</span>}
            </div>

            <div className="form-group full-width">
              <label htmlFor="objectives">Project Objectives *</label>
              <textarea
                id="objectives"
                name="objectives"
                value={formData.objectives}
                onChange={handleInputChange}
                className={errors.objectives ? 'error' : ''}
                placeholder="List the main objectives of this project"
                rows="3"
              />
              {errors.objectives && <span className="error-text">{errors.objectives}</span>}
            </div>
          </div>

          <div className="form-section">
            <h3>Implementation Details</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="expected_beneficiaries">Expected Beneficiaries</label>
                <input
                  type="number"
                  id="expected_beneficiaries"
                  name="expected_beneficiaries"
                  value={formData.expected_beneficiaries}
                  onChange={handleInputChange}
                  placeholder="Number of people to benefit"
                  min="0"
                />
              </div>
            </div>

            <div className="form-group full-width">
              <label htmlFor="implementation_strategy">Implementation Strategy</label>
              <textarea
                id="implementation_strategy"
                name="implementation_strategy"
                value={formData.implementation_strategy}
                onChange={handleInputChange}
                placeholder="Describe how the project will be implemented"
                rows="4"
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="monitoring_plan">Monitoring & Evaluation Plan</label>
              <textarea
                id="monitoring_plan"
                name="monitoring_plan"
                value={formData.monitoring_plan}
                onChange={handleInputChange}
                placeholder="Describe how progress will be monitored and evaluated"
                rows="3"
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="risk_assessment">Risk Assessment</label>
              <textarea
                id="risk_assessment"
                name="risk_assessment"
                value={formData.risk_assessment}
                onChange={handleInputChange}
                placeholder="Identify potential risks and mitigation strategies"
                rows="3"
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="sustainability_plan">Sustainability Plan</label>
              <textarea
                id="sustainability_plan"
                name="sustainability_plan"
                value={formData.sustainability_plan}
                onChange={handleInputChange}
                placeholder="Describe how the project benefits will be sustained long-term"
                rows="3"
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit for Approval'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectCreationForm;