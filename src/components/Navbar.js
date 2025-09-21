import React from 'react';
import './Navbar.css';

const Navbar = ({ user, onLogout }) => {
  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'central_ministry':
        return 'Central Ministry';
      case 'state_admin':
        return 'State Administrator';
      case 'village_committee':
        return 'Village Committee';
      case 'implementing_agency':
        return 'Implementing Agency';
      default:
        return role;
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'central_ministry':
        return '🏛️';
      case 'state_admin':
        return '🏢';
      case 'village_committee':
        return '🏘️';
      case 'implementing_agency':
        return '🏗️';
      default:
        return '👤';
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <div className="brand-emblem">
            <span className="emblem-icon">🇮🇳</span>
          </div>
          <div className="brand-content">
            <h1 className="brand-title">PM-AJAY Portal</h1>
            <p className="brand-subtitle">Government of India</p>
          </div>
        </div>

        <div className="navbar-user">
          <div className="user-info">
            <div className="user-role">
              <span className="role-icon">{getRoleIcon(user.role)}</span>
              <span className="role-text">{getRoleDisplayName(user.role)}</span>
            </div>
            <div className="user-details">
              <span className="user-name">{user.name}</span>
              {user.department && (
                <span className="user-department">{user.department}</span>
              )}
              {user.state && (
                <span className="user-location">{user.state}</span>
              )}
              {user.village && (
                <span className="user-location">{user.village}, {user.district}</span>
              )}
              {user.type && (
                <span className="user-type">{user.type}</span>
              )}
            </div>
          </div>
          
          <button 
            onClick={onLogout}
            className="logout-btn"
            title="Secure Logout"
          >
            <span className="logout-icon">🔒</span>
            <span className="logout-text">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;