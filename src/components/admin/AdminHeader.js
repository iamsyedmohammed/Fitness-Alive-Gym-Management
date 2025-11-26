import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faUserPlus,
  faBell,
  faBirthdayCake,
  faUser
} from '@fortawesome/free-solid-svg-icons';
import './AdminHeader.css';

const AdminHeader = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  // Get admin email from localStorage or use default
  const adminEmail = localStorage.getItem('adminEmail') || 'admin@gym.com';
  
  // Calculate member since date (default to Nov 2012 or use current date)
  const memberSinceDate = new Date('2012-11-01');
  const memberSinceFormatted = memberSinceDate.toLocaleDateString('en-US', { 
    month: 'short', 
    year: 'numeric' 
  });

  const handleSearch = (e) => {
    e.preventDefault();
    // Handle search functionality
    console.log('Searching for:', searchQuery);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminEmail');
    navigate('/admin/login');
  };

  const handleChangePassword = () => {
    // Handle change password functionality
    console.log('Change password clicked');
    setIsProfileOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileOpen]);

  return (
    <header className="admin-header">
      <div className="admin-header-content">
        <div className="header-right">
          <form className="header-search" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Enter ID/No."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-button">
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </form>

          <div className="header-icons">
            <div className="header-icon-wrapper">
              <FontAwesomeIcon icon={faUserPlus} className="header-icon" />
              <span className="notification-dot red-dot"></span>
            </div>

            <div className="header-icon-wrapper">
              <FontAwesomeIcon icon={faBell} className="header-icon" />
              <span className="notification-badge red-badge">6</span>
            </div>

            <div className="header-icon-wrapper">
              <FontAwesomeIcon icon={faBirthdayCake} className="header-icon" />
              <span className="notification-badge green-badge">18</span>
            </div>
          </div>

          <div className="header-profile" ref={profileRef}>
            <div 
              className="profile-trigger"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <div className="profile-avatar">
                <FontAwesomeIcon icon={faUser} className="profile-icon" />
              </div>
              <span className="profile-name">Admin</span>
            </div>

            {isProfileOpen && (
              <div className="profile-dropdown">
                <div className="profile-dropdown-header">
                  <div className="profile-dropdown-avatar">
                    <FontAwesomeIcon icon={faUser} className="profile-icon-large" />
                  </div>
                  <div className="profile-dropdown-info">
                    <div className="profile-email">{adminEmail} - Admin</div>
                    <div className="profile-member-since">Member since {memberSinceFormatted}</div>
                  </div>
                </div>
                
                <div className="profile-dropdown-body">
                  <div className="profile-change-password" onClick={handleChangePassword}>
                    Change Password
                  </div>
                </div>

                <div className="profile-dropdown-footer">
                  <button className="profile-logout-btn" onClick={handleLogout}>
                    Log Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;

