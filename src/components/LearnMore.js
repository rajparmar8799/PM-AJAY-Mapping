import React from 'react';
import { Link } from 'react-router-dom';
import './LearnMore.css';

const LearnMore = () => {
  return (
    <div className="learn-more-page">
      {/* Header */}
      <header className="learn-more-header">
        <div className="header-content">
          <Link to="/" className="logo">
            <span className="logo-text">PM-AJAY Portal</span>
          </Link>
          <Link to="/" className="back-link">
            Back to home
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="learn-more-hero">
        <div className="hero-content">
          <h1 className="hero-title">Understanding PM-AJAY</h1>
          <p className="hero-subtitle">
            Pradhan Mantri Anusuchit Jaati Abhyuday Yojana - Empowering Communities Through Integrated Development
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="intro-section">
        <div className="container">
          <div className="intro-content">
            <h2>What is PM-AJAY?</h2>
            <p>
              Pradhan Mantri Anusuchit Jaati Abhyuday Yojana (PM-AJAY) is a flagship scheme under the
              Ministry of Social Justice & Empowerment, Government of India. Launched to uplift Scheduled Castes
              through comprehensive village development, the scheme focuses on integrated infrastructure support
              and educational facilities to create sustainable development in rural areas.
            </p>
            <div className="key-stats">
              <div className="stat-item">
                <span className="stat-number">₹3,200 Cr</span>
                <span className="stat-label">Total Budget Allocation</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">28</span>
                <span className="stat-label">States/UTs Covered</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">200+</span>
                <span className="stat-label">Active Projects</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">75%</span>
                <span className="stat-label">Average Completion Rate</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scheme Components */}
      <section className="components-section">
        <div className="container">
          <h2>The Three Pillars of PM-AJAY</h2>
          <p className="section-intro">
            PM-AJAY operates through three interconnected components that work together to create
            sustainable development in Scheduled Caste communities.
          </p>

          <div className="components-grid">
            <div className="component-card">
              <div className="component-header">
                <div className="component-icon">🏘️</div>
                <h3>Adarsh Gram Yojana</h3>
                <span className="component-tag">Infrastructure</span>
              </div>
              <div className="component-content">
                <p>
                  Integrated development of villages with comprehensive infrastructure including roads,
                  drinking water, sanitation, community centers, health and education facilities.
                </p>
                <h4>Key Features:</h4>
                <ul>
                  <li>Rural road connectivity</li>
                  <li>Drinking water facilities</li>
                  <li>Sanitation and hygiene infrastructure</li>
                  <li>Community centers and public spaces</li>
                  <li>Primary health centers</li>
                  <li>Educational facilities</li>
                </ul>
                <div className="component-stats">
                  <span className="budget">₹2,000 Cr Allocated</span>
                  <span className="coverage">150 Villages Targeted</span>
                </div>
              </div>
            </div>

            <div className="component-card">
              <div className="component-header">
                <div className="component-icon">🏫</div>
                <h3>Hostels for SC Students</h3>
                <span className="component-tag">Education</span>
              </div>
              <div className="component-content">
                <p>
                  Construction and maintenance of hostels for Scheduled Caste boys and girls to ensure
                  access to quality education and reduce dropout rates.
                </p>
                <h4>Key Features:</h4>
                <ul>
                  <li>Modern hostel facilities</li>
                  <li>Educational support services</li>
                  <li>Nutritional support</li>
                  <li>Counseling and mentorship</li>
                  <li>Transportation facilities</li>
                  <li>Digital learning resources</li>
                </ul>
                <div className="component-stats">
                  <span className="budget">₹800 Cr Allocated</span>
                  <span className="coverage">50,000 Students Benefited</span>
                </div>
              </div>
            </div>

            <div className="component-card">
              <div className="component-header">
                <div className="component-icon">💰</div>
                <h3>Grant-in-Aid</h3>
                <span className="component-tag">Economic Support</span>
              </div>
              <div className="component-content">
                <p>
                  Financial assistance to states, NGOs, and community organizations for projects that
                  benefit Scheduled Castes through skill development and livelihood generation.
                </p>
                <h4>Key Features:</h4>
                <ul>
                  <li>Skill development programs</li>
                  <li>Livelihood generation projects</li>
                  <li>Community asset creation</li>
                  <li>Entrepreneurship support</li>
                  <li>Financial literacy programs</li>
                  <li>Market linkages</li>
                </ul>
                <div className="component-stats">
                  <span className="budget">₹400 Cr Allocated</span>
                  <span className="coverage">25,000 Families Supported</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Implementation Strategy */}
      <section className="implementation-section">
        <div className="container">
          <h2>Implementation Strategy</h2>
          <div className="implementation-content">
            <div className="strategy-grid">
              <div className="strategy-card">
                <h3>🎯 Planning Phase</h3>
                <p>
                  Comprehensive village assessments and community consultations to identify specific needs
                  and development priorities for each location.
                </p>
              </div>
              <div className="strategy-card">
                <h3>🏗️ Execution Phase</h3>
                <p>
                  Implementation through empaneled agencies with regular monitoring and quality assurance
                  to ensure timely and effective project delivery.
                </p>
              </div>
              <div className="strategy-card">
                <h3>📊 Monitoring Phase</h3>
                <p>
                  Real-time tracking of project progress, fund utilization, and impact assessment through
                  the PM-AJAY portal and field monitoring teams.
                </p>
              </div>
              <div className="strategy-card">
                <h3>🎉 Sustainability Phase</h3>
                <p>
                  Capacity building and community ownership to ensure long-term sustainability of
                  development initiatives and continued benefits.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact & Benefits */}
      <section className="impact-section">
        <div className="container">
          <h2>Expected Impact & Benefits</h2>
          <div className="impact-content">
            <div className="impact-grid">
              <div className="impact-card">
                <h3>🏘️ Village Development</h3>
                <ul>
                  <li>Improved infrastructure and connectivity</li>
                  <li>Better access to essential services</li>
                  <li>Enhanced quality of life</li>
                  <li>Economic development opportunities</li>
                </ul>
              </div>
              <div className="impact-card">
                <h3>🎓 Education Enhancement</h3>
                <ul>
                  <li>Reduced dropout rates</li>
                  <li>Increased enrollment in higher education</li>
                  <li>Better learning outcomes</li>
                  <li>Long-term career opportunities</li>
                </ul>
              </div>
              <div className="impact-card">
                <h3>💼 Economic Empowerment</h3>
                <ul>
                  <li>Skill development and training</li>
                  <li>Employment generation</li>
                  <li>Entrepreneurship opportunities</li>
                  <li>Financial inclusion</li>
                </ul>
              </div>
              <div className="impact-card">
                <h3>🤝 Social Inclusion</h3>
                <ul>
                  <li>Community participation</li>
                  <li>Social cohesion</li>
                  <li>Reduced inequalities</li>
                  <li>Empowered communities</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Explore PM-AJAY?</h2>
            <p>
              Discover how PM-AJAY is transforming communities across India through integrated development initiatives.
            </p>
            <div className="cta-buttons">
              <Link to="/public" className="btn btn-primary">
                View Live Dashboard
              </Link>
              <Link to="/login" className="btn btn-secondary">
                Access Portal
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="learn-more-footer">
        <div className="footer-content">
          <div className="footer-links">
            <Link to="/">Home</Link>
            <Link to="/public">Dashboard</Link>
            <Link to="/login">Login</Link>
          </div>
          <div className="footer-copyright">
            © 2024 Ministry of Social Justice & Empowerment, Government of India
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LearnMore;