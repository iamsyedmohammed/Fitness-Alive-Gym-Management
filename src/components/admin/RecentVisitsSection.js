import React from 'react';
import { Link } from 'react-router-dom';
import './DashboardSections.css';

const RecentVisitsSection = ({ visits = [], currentMonthName }) => {
  const monthName = currentMonthName || new Date().toLocaleString('default', { month: 'long' });
  const capitalizedMonthName = monthName.charAt(0).toUpperCase() + monthName.slice(1);
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return '';
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    if (imageUrl.startsWith('/')) {
      return `https://slateblue-turkey-331136.hostingersite.com${imageUrl}`;
    }
    return `https://slateblue-turkey-331136.hostingersite.com/${imageUrl}`;
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${String(displayHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')} ${ampm}`;
  };

  const truncateName = (name, maxLength = 12) => {
    if (!name) return 'Unknown';
    if (name.length <= maxLength) return name;
    return name.substring(0, maxLength) + '...';
  };

  return (
    <div className="dashboard-section-card recent-visits">
      <div className="section-header">
        <h2>{capitalizedMonthName} Recent Visits</h2>
        <span className="section-underline green"></span>
      </div>
      <div className="members-grid">
        {visits.slice(0, 6).map((visit, index) => (
          <div key={index} className="member-item">
            <div className="member-image-wrapper">
              {visit.image_url ? (
                <img 
                  src={getImageUrl(visit.image_url)} 
                  alt={visit.name}
                  className="member-image"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className="member-image-placeholder" style={{ display: visit.image_url ? 'none' : 'flex' }}>
                {visit.name?.charAt(0).toUpperCase() || '?'}
              </div>
            </div>
            <div className="member-name" title={visit.name || 'Unknown'}>{truncateName(visit.name)}</div>
            <div className="member-meta">{formatTime(visit.visit_time || visit.created_at)}</div>
          </div>
        ))}
      </div>
      <Link to="/admin/attendance" className="view-all-btn">
        View All Visits
      </Link>
    </div>
  );
};

export default RecentVisitsSection;

