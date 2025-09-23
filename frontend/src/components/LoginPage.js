import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './LoginPage.css';

const LoginPage = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);

  // User profiles for quick login
  const userProfiles = [
    {
      role: 'central_ministry',
      icon: '🏛️',
      title: 'Central Ministry',
      subtitle: 'Policy Management & Fund Allocation',
      user: {
        id: 'cm001',
        username: 'ministry_admin',
        role: 'central_ministry',
        name: 'Dr. Rajesh Kumar',
        department: 'Ministry of Rural Development'
      },
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      role: 'state_admin',
      icon: '🏢',
      title: 'State Admin',
      subtitle: 'State-level Project Coordination',
      user: {
        id: 'sa001',
        username: 'maharashtra_admin',
        role: 'state_admin',
        name: 'Shri Anil Deshmukh',
        state: 'Maharashtra'
      },
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      role: 'village_committee',
      icon: '🏘️',
      title: 'Village Committee',
      subtitle: 'Village-level Development & Monitoring',
      user: {
        id: 'vc001',
        username: 'village_head1',
        role: 'village_committee',
        name: 'Sarpanch Sunita Devi',
        village: 'Ramgarh',
        state: 'Haryana'
      },
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    {
      role: 'implementing_agency',
      icon: '🏗️',
      title: 'Infrastructure Agency',
      subtitle: 'Infrastructure Development',
      user: {
        id: 'ia001',
        username: 'infra_agency1',
        role: 'implementing_agency',
        name: 'Bharat Infrastructure Ltd',
        type: 'Infrastructure Development'
      },
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
    },
    {
      role: 'implementing_agency',
      icon: '🏗️',
      title: 'Construction Agency',
      subtitle: 'Construction & Infrastructure',
      user: {
        id: 'ia003',
        username: 'construction_agency1',
        role: 'implementing_agency',
        name: 'National Construction Corp',
        type: 'Construction & Infrastructure'
      },
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
    }
  ];

  const handleQuickLogin = async (userProfile) => {
    setLoading(true);
    
    try {
      const response = await api.post('/api/auth/login', {
        username: userProfile.user.username,
        password: 'demo123',
        role: userProfile.user.role
      });
      
      const { token, user } = response.data;
      
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      
      onLogin(user, token);
    } catch (error) {
      console.error('Login error:', error);
      alert('Starting backend servers , can you please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="login-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Authenticating...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      {/* Header */}
      <header className="login-header">
        <div className="header-content">
          <Link to="/" className="logo">
            <span className="logo-text">PM-AJAY Portal</span>
          </Link>
          <Link to="/" className="back-link">
            Back to home
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="login-main">
        <div className="login-container">
          <div className="login-card">
            <div className="login-header">
              <h1 className="login-title">Sign in</h1>
              <p className="login-subtitle">to continue to PM-AJAY Portal</p>
            </div>

            <div className="login-content">
              <div className="role-selection">
                <h2 className="section-title">Choose your role</h2>
                <div className="role-grid">
                  {userProfiles.map((profile, index) => (
                    <div
                      key={index}
                      className="role-card"
                      onClick={() => handleQuickLogin(profile)}
                    >
                      <div className="role-icon">{profile.icon}</div>
                      <div className="role-info">
                        <h3 className="role-title">{profile.title}</h3>
                        <p className="role-subtitle">{profile.subtitle}</p>
                        <div className="user-details">
                          <span className="user-name">{profile.user.name}</span>
                          {profile.user.state && (
                            <span className="user-location">{profile.user.state}</span>
                          )}
                          {profile.user.village && (
                            <span className="user-location">{profile.user.village}</span>
                          )}
                        </div>
                      </div>
                      <div className="role-arrow">→</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="login-footer">
                <div className="demo-notice">
                  <span className="notice-icon">ℹ️</span>
                  <div className="notice-text">
                    <strong>Demo Mode:</strong> All accounts use password <code>demo123</code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="login-footer">
        <div className="footer-content">
          <div className="footer-links">
            <a href="#help">Help</a>
            <a href="#privacy">Privacy</a>
            <a href="#terms">Terms</a>
          </div>
          <div className="footer-copyright">
            © 2024 Ministry of Rural Development, Government of India
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;
