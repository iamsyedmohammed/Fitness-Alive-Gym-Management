import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserTie } from '@fortawesome/free-solid-svg-icons';
import './TrainersSection.css';

const TrainersSection = () => {
  // This will be populated from API later
  const trainers = [
    { id: 1, name: 'Trainer Name', specialization: 'Lorem Specialist' },
    { id: 2, name: 'Trainer Name', specialization: 'Lorem Specialist' },
    { id: 3, name: 'Trainer Name', specialization: 'Lorem Specialist' },
    { id: 4, name: 'Trainer Name', specialization: 'Lorem Specialist' }
  ];

  return (
    <section className="trainers-section" id="trainers">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Our Team</span>
          <h2 className="section-title">OUR EXPERIENCED TRAINERS</h2>
          <p className="section-subtitle">
            Meet our certified professionals dedicated to guiding you every step of the way towards your fitness goals.
          </p>
        </div>
        <div className="trainers-grid">
          {trainers.map((trainer) => (
            <div key={trainer.id} className="trainer-card">
              <div className="trainer-image-wrapper">
                <div className="trainer-placeholder">
                  <FontAwesomeIcon icon={faUserTie} className="trainer-icon" />
                </div>
              </div>
              <div className="trainer-info">
                <h3 className="trainer-name">{trainer.name}</h3>
                <p className="trainer-specialization">{trainer.specialization}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrainersSection;

