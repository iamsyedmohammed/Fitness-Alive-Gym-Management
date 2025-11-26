import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUsers, 
  faMapMarkerAlt,
  faStar,
  faCalendarAlt
} from '@fortawesome/free-solid-svg-icons';
import './StatsSection.css';

const StatsSection = () => {
  const stats = [
    {
      icon: faUsers,
      number: '10,000',
      label: 'Members'
    },
    {
      icon: faMapMarkerAlt,
      number: '2',
      label: 'Locations'
    },
    {
      icon: faStar,
      number: '4.5',
      label: 'Stars Ratings'
    },
    {
      icon: faCalendarAlt,
      number: '10+',
      label: 'Years'
    }
  ];

  return (
    <section className="stats-section">
      <div className="stats-background">
        <img 
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
          alt="Stats Background"
          className="stats-bg-image"
        />
        <div className="stats-overlay"></div>
      </div>
      <div className="container">
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-item">
              <div className="stat-icon-wrapper">
                <FontAwesomeIcon icon={stat.icon} />
              </div>
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;

