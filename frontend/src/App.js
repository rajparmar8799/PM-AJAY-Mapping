import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';

// Components
import LoginPage from './components/LoginPage';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import LearnMore from './components/LearnMore';
import PublicDashboard from './components/PublicDashboard';
import CentralMinistryDashboard from './components/CentralMinistryDashboard';
import StateAdminDashboard from './components/StateAdminDashboard';
import VillageCommitteeDashboard from './components/VillageCommitteeDashboard';
import ImplementingAgencyDashboard from './components/ImplementingAgencyDashboard';

// Set default axios configuration
axios.defaults.baseURL = 'http://localhost:5000';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    if (token) {
      // For demo mode, try to get user from localStorage first
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          setLoading(false);
          return;
        } catch (error) {
          console.error('Error parsing stored user:', error);
        }
      }

      // Fallback to API call if available
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      axios.get('/api/auth/profile')
        .then(response => {
          setUser(response.data);
        })
        .catch(error => {
          console.error('Token verification failed:', error);
          // In demo mode, don't logout on API failure
          if (!token.startsWith('mock-token')) {
            handleLogout();
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [token]);

  const handleLogin = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('token', authToken);
    axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  };

  const renderDashboard = () => {
    if (!user) return <Navigate to="/login" />;

    switch (user.role) {
      case 'central_ministry':
        return <CentralMinistryDashboard user={user} />;
      case 'state_admin':
        return <StateAdminDashboard user={user} />;
      case 'village_committee':
        return <VillageCommitteeDashboard user={user} />;
      case 'implementing_agency':
        return <ImplementingAgencyDashboard user={user} />;
      default:
        return <div>Invalid user role</div>;
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading PM AJAY SETU...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        {user && <Navbar user={user} onLogout={handleLogout} />}
        
        <Routes>
          <Route
            path="/"
            element={<LandingPage />}
          />
          <Route
            path="/learn-more"
            element={<LearnMore />}
          />
          <Route
            path="/login"
            element={!user ? <LoginPage onLogin={handleLogin} /> : <Navigate to="/dashboard" />}
          />
          <Route
            path="/dashboard"
            element={renderDashboard()}
          />
          <Route
            path="/public"
            element={<PublicDashboard />}
          />
          <Route
            path="*"
            element={<Navigate to="/" />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;