import React from 'react';
import { Link } from 'react-router-dom';
import './DashboardSections.css';

const NewMembersSection = ({ members = [], currentMonthName }) => {
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

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const truncateName = (name, maxLength = 12) => {
    if (!name) return 'Unknown';
    if (name.length <= maxLength) return name;
    return name.substring(0, maxLength) + '...';
  };

  return (
    <div className="dashboard-section-card new-members">
      <div className="section-header">
        <h2>{capitalizedMonthName} New Members</h2>
        <span className="section-underline purple"></span>
      </div>
      <div className="members-grid">
        {members.slice(0, 6).map((member, index) => (
          <div key={index} className="member-item">
            <div className="member-image-wrapper">
              {member.image_url ? (
                <img 
                  src={getImageUrl(member.image_url)} 
                  alt={member.name}
                  className="member-image"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className="member-image-placeholder" style={{ display: member.image_url ? 'none' : 'flex' }}>
                {member.name?.charAt(0).toUpperCase() || '?'}
              </div>
            </div>
            <div className="member-name" title={member.name || 'Unknown'}>{truncateName(member.name)}</div>
            <div className="member-meta">{formatDate(member.start_date || member.created_at)}</div>
          </div>
        ))}
      </div>
      <Link to="/admin/members" className="view-all-btn">
        View All Users
      </Link>
    </div>
  );
};

export default NewMembersSection;

