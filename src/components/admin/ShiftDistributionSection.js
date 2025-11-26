import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon, faUser, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import './DashboardSections.css';

const ShiftDistributionSection = ({ morningCount = 0, eveningCount = 0, malesCount = 0 }) => {
  return (
    <div className="shift-distribution-container">
      <div className="shift-card morning">
        <FontAwesomeIcon icon={faSun} className="shift-icon" />
        <div className="shift-content">
          <div className="shift-label">MORNING</div>
          <div className="shift-count">{morningCount} Member(s)</div>
          <div className="shift-more-info">
            More info <FontAwesomeIcon icon={faArrowRight} style={{ marginLeft: '5px' }} />
          </div>
        </div>
      </div>
      
      <div className="shift-card evening">
        <FontAwesomeIcon icon={faMoon} className="shift-icon" />
        <div className="shift-content">
          <div className="shift-label">EVENING</div>
          <div className="shift-count">{eveningCount} Member(s)</div>
          <div className="shift-more-info">
            More info <FontAwesomeIcon icon={faArrowRight} style={{ marginLeft: '5px' }} />
          </div>
        </div>
      </div>
      
      <div className="shift-card males">
        <FontAwesomeIcon icon={faUser} className="shift-icon" />
        <div className="shift-content">
          <div className="shift-label">MALES</div>
          <div className="shift-count">{malesCount} Member(s)</div>
          <div className="shift-more-info">
            More info <FontAwesomeIcon icon={faArrowRight} style={{ marginLeft: '5px' }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShiftDistributionSection;

