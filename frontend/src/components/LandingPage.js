import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Government Header */}
      <header className="gov-header">
        <div className="gov-header-content">
          <div className="gov-logo">
            <img
              src="https://i.pinimg.com/736x/82/00/5e/82005ec86b6879964de229b9b3262ecd.jpg"
              alt="Government of India"
              className="gov-logo-image"
            />
            <div className="gov-title">
              <h1>PM AJAY SETU</h1>
              <p>Ministry of Social Justice & Empowerment</p>
            </div>
          </div>
          <nav className="gov-nav">
            <a href="#home">Home</a>
            <Link to="/public">Dashboard</Link>
            <a href="#reports">Reports</a>
            <a href="#communication">Communication</a>
            <a href="#resources">Resources</a>
            <Link to="/login" className="login-btn">Login</Link>
          </nav>
        </div>
      </header>

      {/* Government Hero Section */}
      <section className="hero-section" id="home">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">PM-AJAY: Empowering Communities, Connecting Agencies</h1>
            <p className="hero-subtitle">
              Pradhan Mantri Anusuchit Jaati Abhyuday Yojana
            </p>
            <p className="hero-description">
              A flagship scheme under the Ministry of Social Justice & Empowerment aimed at uplifting
              Scheduled Castes through integrated village development, infrastructure support, and educational facilities.
            </p>
            <div className="hero-buttons">
              <Link to="/login" className="btn btn-primary btn-lg">
                Access Portal
              </Link>
              <Link to="/learn-more" className="btn btn-secondary btn-lg">
                Learn More
              </Link>
              <Link to="/public" className="btn btn-outline btn-lg">
                View Dashboard
              </Link>
            </div>
          </div>
          <div className="hero-banner">
            <div className="banner-placeholder">
              <p>Empowering Communities</p>
            </div>
          </div>
        </div>
      </section>

      {/* Scheme Introduction */}
      <section className="scheme-intro-section">
        <div className="container">
          <div className="scheme-intro">
            <h2>About PM-AJAY</h2>
            <p>
              Pradhan Mantri Anusuchit Jaati Abhyuday Yojana (PM-AJAY) is a flagship scheme under the
              Ministry of Social Justice & Empowerment. Its goal is to uplift Scheduled Castes through
              integrated development of villages, infrastructure support, and educational facilities.
            </p>
          </div>
        </div>
      </section>

      {/* Components Overview */}
      <section className="components-section">
        <div className="container">
          <h2 className="section-title">Scheme Components</h2>
          <div className="components-grid">
            <div className="component-card">
              <div className="component-icon">🏘️</div>
              <h3>Adarsh Gram Yojana</h3>
              <p>
                Integrated development of villages with basic infrastructure including roads,
                drinking water, sanitation, community centers, health and education facilities.
                Aim: Make selected villages "model villages."
              </p>
            </div>
            <div className="component-card">
              <div className="component-icon">🏫</div>
              <h3>Hostels for SC Students</h3>
              <p>
                Construction of hostels for SC boys and girls across states/UTs.
                Aim: Provide safe residential facilities to support education and reduce dropouts.
              </p>
            </div>
            <div className="component-card">
              <div className="component-icon">💰</div>
              <h3>Grant-in-Aid</h3>
              <p>
                Financial support to states/NGOs for projects that benefit Scheduled Castes.
                Includes: Skill development, community assets, and livelihood generation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Live Project Dashboard */}
      <section className="dashboard-section" id="dashboard">
        <div className="container">
          <h2 className="section-title">Live Project Dashboard</h2>
          <div className="map-container">
            <div className="map-placeholder">
              <span>🗺️</span>
              <h3>Interactive Project Map</h3>
              <p>View ongoing, completed, and upcoming projects across India</p>
              <Link to="/public" className="btn btn-primary">View Full Dashboard</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Smart Summary Box */}
      <section className="summary-section">
        <div className="container">
          <div className="summary-box">
            <h3>Scheme Progress Overview</h3>
            <div className="summary-grid">
              <div className="summary-item">
                <span className="summary-number">200+</span>
                <span className="summary-label">Active Projects</span>
              </div>
              <div className="summary-item">
                <span className="summary-number">₹3,200 Cr</span>
                <span className="summary-label">Funds Allocated</span>
              </div>
              <div className="summary-item">
                <span className="summary-number">75%</span>
                <span className="summary-label">Average Completion</span>
              </div>
              <div className="summary-item">
                <span className="summary-number">28</span>
                <span className="summary-label">States/UTs Covered</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reports Section */}
      <section className="reports-section" id="reports">
        <div className="container">
          <h2 className="section-title">Reports & Downloads</h2>
          <div className="reports-grid">
            <div className="report-card">
              <div className="report-icon">📊</div>
              <h3>Progress Report</h3>
              <p>Monthly progress updates and completion status</p>
              <button className="btn btn-secondary">Download PDF</button>
            </div>
            <div className="report-card">
              <div className="report-icon">💰</div>
              <h3>Financial Summary</h3>
              <p>Fund utilization and budget allocation reports</p>
              <button className="btn btn-secondary">Download PDF</button>
            </div>
            <div className="report-card">
              <div className="report-icon">📈</div>
              <h3>Impact Assessment</h3>
              <p>Social impact and beneficiary reach analysis</p>
              <button className="btn btn-secondary">Download PDF</button>
            </div>
          </div>
        </div>
      </section>

      {/* Communication Hub */}
      <section className="communication-section" id="communication">
        <div className="container">
          <h2 className="section-title">Communication Hub</h2>
          <div className="communication-grid">
            <div className="communication-card">
              <div className="comm-icon">💬</div>
              <h3>Agency Updates</h3>
              <p>Latest announcements and updates from implementing agencies</p>
              <div className="comm-updates">
                <div className="update-item">
                  <span className="update-time">2 hours ago</span>
                  <p>New hostel construction started in Rajasthan</p>
                </div>
                <div className="update-item">
                  <span className="update-time">1 day ago</span>
                  <p>Adarsh Gram project completed in Uttar Pradesh</p>
                </div>
              </div>
            </div>
            <div className="communication-card">
              <div className="comm-icon">📢</div>
              <h3>Government Announcements</h3>
              <p>Official notifications and policy updates</p>
              <div className="comm-updates">
                <div className="update-item">
                  <span className="update-time">3 days ago</span>
                  <p>Extended deadline for Q4 proposals</p>
                </div>
                <div className="update-item">
                  <span className="update-time">1 week ago</span>
                  <p>New guidelines for fund utilization released</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="resources-section" id="resources">
        <div className="container">
          <h2 className="section-title">Resources</h2>
          <div className="resources-grid">
            <div className="resource-card">
              <div className="resource-icon">📋</div>
              <h3>Project Guidelines</h3>
              <p>Detailed guidelines for project implementation and fund utilization</p>
              <button className="btn btn-outline">View Guidelines</button>
            </div>
            <div className="resource-card">
              <div className="resource-icon">🎓</div>
              <h3>Training Materials</h3>
              <p>Training modules and capacity building resources</p>
              <button className="btn btn-outline">Access Training</button>
            </div>
            <div className="resource-card">
              <div className="resource-icon">❓</div>
              <h3>Help & FAQs</h3>
              <p>Frequently asked questions and support documentation</p>
              <button className="btn btn-outline">Get Help</button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-main">
            <div className="footer-section">
              <h4>Ministry of Social Justice & Empowerment</h4>
              <p>Government of India</p>
              <p>PM AJAY SETU - Pradhan Mantri Anusuchit Jaati Abhyuday Yojana</p>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li><Link to="/login">Portal Login</Link></li>
                <li><Link to="/public">Live Dashboard</Link></li>
                <li><a href="#reports">Reports</a></li>
                <li><a href="#resources">Resources</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Contact Information</h4>
              <p>Shastri Bhawan, New Delhi - 110001</p>
              <p>Email: pmajay@gov.in</p>
              <p>Phone: +91-11-23383778</p>
            </div>
            <div className="footer-section">
              <h4>Follow Us</h4>
              <div className="social-links">
                <span>📧</span>
                <span>🌐</span>
                <span>📱</span>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>&copy; 2024 Ministry of Social Justice & Empowerment, Government of India. All rights reserved.</p>
            <p>Designed & Developed for Digital India Initiative</p>
          </div>
          <div className="footer-badges">
            <span className="badge">🇮🇳 Made in India</span>
            <span className="badge">🔒 Secure Platform</span>
            <span className="badge">♿ Accessible</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;