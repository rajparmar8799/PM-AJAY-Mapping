import React from 'react';
import { Link } from 'react-router-dom';
import './LearnMore.css';

const LearnMore = () => {
  return (
    <div className="learn-more-page">
      {/* Header */}
      <header className="learn-more-header">
        <div className="header-content">
          <Link to="/" className="back-home">
            <span className="back-icon">←</span>
            Back to Home
          </Link>
          <h1>PM-AJAY Yojna</h1>
          <p>Comprehensive Rural Development Initiative</p>
        </div>
      </header>

      {/* Hero Section */}
      <section className="learn-hero">
        <div className="container">
          <div className="hero-content">
            <h2>Transforming Rural India Through Digital Innovation</h2>
            <p>
              PM-AJAY Yojna is a flagship initiative by the Ministry of Rural Development,
              Government of India, designed to accelerate rural development through
              technology-driven project management and transparent fund utilization.
            </p>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="overview-section">
        <div className="container">
          <h2>Program Overview</h2>
          <div className="overview-grid">
            <div className="overview-card">
              <div className="overview-icon">🎯</div>
              <h3>Mission</h3>
              <p>
                To create sustainable rural infrastructure and improve quality of life
                for millions of rural citizens through efficient project execution
                and transparent governance.
              </p>
            </div>
            <div className="overview-card">
              <div className="overview-icon">💰</div>
              <h3>Budget Allocation</h3>
              <p>
                Over ₹3,200 crore allocated across various development sectors,
                ensuring comprehensive coverage of rural development needs.
              </p>
            </div>
            <div className="overview-card">
              <div className="overview-icon">📊</div>
              <h3>Impact Metrics</h3>
              <p>
                200+ active projects, 28 states covered, and over 1 million lives
                positively impacted through targeted interventions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Three Components Section */}
      <section className="components-section">
        <div className="container">
          <h2>The Three Pillars of PM-AJAY</h2>
          <p className="section-subtitle">
            PM-AJAY operates through three interconnected components that work synergistically
            to achieve comprehensive rural development.
          </p>

          <div className="components-grid">
            {/* Component 1 */}
            <div className="component-card">
              <div className="component-header">
                <div className="component-number">01</div>
                <h3>Digital Infrastructure Development</h3>
              </div>
              <div className="component-content">
                <p>
                  Building robust digital infrastructure to connect rural communities
                  with modern technology solutions and government services.
                </p>
                <ul>
                  <li>High-speed internet connectivity in rural areas</li>
                  <li>Digital literacy programs for rural youth</li>
                  <li>E-governance platforms for local administration</li>
                  <li>Smart village management systems</li>
                </ul>
              </div>
            </div>

            {/* Component 2 */}
            <div className="component-card">
              <div className="component-header">
                <div className="component-number">02</div>
                <h3>Economic Empowerment Initiatives</h3>
              </div>
              <div className="component-content">
                <p>
                  Creating sustainable livelihood opportunities and economic growth
                  through skill development and entrepreneurship programs.
                </p>
                <ul>
                  <li>Vocational training centers in rural areas</li>
                  <li>Women entrepreneurship programs</li>
                  <li>Agriculture technology adoption</li>
                  <li>Micro-enterprise development support</li>
                </ul>
              </div>
            </div>

            {/* Component 3 */}
            <div className="component-card">
              <div className="component-header">
                <div className="component-number">03</div>
                <h3>Social Infrastructure Enhancement</h3>
              </div>
              <div className="component-content">
                <p>
                  Improving essential social services and community infrastructure
                  to enhance quality of life and social development indicators.
                </p>
                <ul>
                  <li>Healthcare facility upgrades</li>
                  <li>Education infrastructure development</li>
                  <li>Safe drinking water and sanitation</li>
                  <li>Community center construction</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Implementation Model */}
      <section className="implementation-section">
        <div className="container">
          <h2>Implementation Framework</h2>
          <div className="implementation-content">
            <div className="implementation-text">
              <h3>How PM-AJAY Works</h3>
              <p>
                The program follows a structured implementation model that ensures
                accountability, transparency, and measurable outcomes.
              </p>
              <div className="implementation-steps">
                <div className="step">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h4>Project Identification</h4>
                    <p>Village committees identify local development needs and priorities.</p>
                  </div>
                </div>
                <div className="step">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <h4>Technical Assessment</h4>
                    <p>State-level technical teams evaluate project feasibility and requirements.</p>
                  </div>
                </div>
                <div className="step">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <h4>Agency Assignment</h4>
                    <p>Qualified implementing agencies are assigned based on expertise and capacity.</p>
                  </div>
                </div>
                <div className="step">
                  <div className="step-number">4</div>
                  <div className="step-content">
                    <h4>Fund Allocation</h4>
                    <p>Central ministry approves and allocates funds for approved projects.</p>
                  </div>
                </div>
                <div className="step">
                  <div className="step-number">5</div>
                  <div className="step-content">
                    <h4>Implementation & Monitoring</h4>
                    <p>Real-time tracking and progress monitoring throughout project lifecycle.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="implementation-visual">
              <div className="process-diagram">
                <div className="process-step">
                  <div className="process-icon">🏘️</div>
                  <p>Village Level</p>
                </div>
                <div className="process-arrow">→</div>
                <div className="process-step">
                  <div className="process-icon">🏛️</div>
                  <p>State Level</p>
                </div>
                <div className="process-arrow">→</div>
                <div className="process-step">
                  <div className="process-icon">🏢</div>
                  <p>Central Level</p>
                </div>
                <div className="process-arrow">→</div>
                <div className="process-step">
                  <div className="process-icon">👷</div>
                  <p>Implementation</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="features-section">
        <div className="container">
          <h2>Key Features & Benefits</h2>
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">🔒</div>
              <h3>Complete Transparency</h3>
              <p>Real-time tracking of fund utilization and project progress visible to all stakeholders.</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">⚡</div>
              <h3>Accelerated Implementation</h3>
              <p>Streamlined processes reduce bureaucratic delays and speed up project completion.</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🎯</div>
              <h3>Data-Driven Decisions</h3>
              <p>Analytics and insights guide resource allocation and optimize development outcomes.</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🤝</div>
              <h3>Collaborative Approach</h3>
              <p>Multi-stakeholder engagement ensures inclusive development and community participation.</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">📱</div>
              <h3>Digital Accessibility</h3>
              <p>Mobile-first design ensures accessibility across devices and connectivity levels.</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">📈</div>
              <h3>Measurable Impact</h3>
              <p>Clear metrics and evaluation frameworks ensure accountability and continuous improvement.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Contribute to Rural Development?</h2>
            <p>Join the PM-AJAY ecosystem and be part of India's rural transformation journey.</p>
            <div className="cta-buttons">
              <Link to="/login" className="btn btn-primary">
                Access Portal
              </Link>
              <Link to="/public" className="btn btn-secondary">
                View Projects
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LearnMore;