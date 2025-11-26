import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers,
  faUserCheck,
  faUserTimes,
  faIndianRupeeSign,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import './StatisticsCards.css';

const StatisticsCards = ({ stats }) => {
  const currentMonthName = stats?.currentMonthName || new Date().toLocaleString('default', { month: 'long' });
  const capitalizedMonthName = currentMonthName.charAt(0).toUpperCase() + currentMonthName.slice(1);
  
  const cardData = [
    { 
      label: `${capitalizedMonthName} Sales`, 
      value: `₹${(stats?.currentMonthSales || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 
      icon: faIndianRupeeSign, 
      color: '#FF9800',
      bgColor: '#FFC107'
    },
    { 
      label: 'Total Members', 
      value: stats?.totalMembers || 0, 
      icon: faUsers, 
      color: '#2196F3',
      bgColor: '#2196F3'
    },
    { 
      label: 'Active Members', 
      value: stats?.activeMembers || 0, 
      icon: faUserCheck, 
      color: '#4CAF50',
      bgColor: '#4CAF50'
    },
    { 
      label: 'Inactive Members', 
      value: stats?.inactiveMembers || 0, 
      icon: faUserTimes, 
      color: '#FF5722',
      bgColor: '#FF5722'
    },
  ];

  return (
    <div className="statistics-cards">
      {cardData.map((card, index) => (
        <div key={index} className="stat-card-new">
          <div className="stat-icon-new" style={{ backgroundColor: card.bgColor }}>
            <FontAwesomeIcon icon={card.icon} style={{ fontSize: '1.5rem', color: '#FFFFFF' }} />
          </div>
          <div className="stat-content-new">
            <div className="stat-label-new">{card.label}</div>
            <div className="stat-value-new">{card.value}</div>
            <div className="stat-divider"></div>
            <div className="stat-more-info">
              More info <FontAwesomeIcon icon={faArrowRight} style={{ marginLeft: '5px', fontSize: '0.8rem' }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatisticsCards;
