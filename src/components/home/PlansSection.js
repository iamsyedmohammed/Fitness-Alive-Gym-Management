import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import './PlansSection.css';

const PlansSection = () => {
  const plans = [
    {
      name: 'Monthly',
      quote: 'Sleep. Work. Train. Repeat.',
      description: 'For the individuals'
    },
    {
      name: 'Quarterly',
      quote: 'Pain is temporary, pride is forever.',
      description: 'For the individuals'
    },
    {
      name: 'Half Yearly',
      quote: 'Winners Train, Losers Complain.',
      description: 'For the individuals'
    },
    {
      name: 'Yearly',
      quote: 'Train like a beast, look like a beauty.',
      description: 'For the individuals'
    }
  ];

  return (
    <section className="plans-section" id="plans">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Membership</span>
          <h2 className="section-title">CHOOSE THE PERFECT PLAN FOR YOU</h2>
          <p className="section-subtitle">
            Flexible membership options to suit your needs. Choose the plan that works best for your fitness journey.
          </p>
        </div>
        <div className="plans-grid">
          {plans.map((plan, index) => (
            <div key={index} className="plan-card">
              <div className="plan-header">
                <h3 className="plan-name">{plan.name}</h3>
                <p className="plan-description">{plan.description}</p>
              </div>
              <div className="plan-quote">
                <p>"{plan.quote}"</p>
              </div>
              <div className="plan-features">
                <div className="feature-item">
                  <FontAwesomeIcon icon={faCheck} className="check-icon" />
                  <span>Full Gym Access</span>
                </div>
                <div className="feature-item">
                  <FontAwesomeIcon icon={faCheck} className="check-icon" />
                  <span>Expert Trainers</span>
                </div>
                <div className="feature-item">
                  <FontAwesomeIcon icon={faCheck} className="check-icon" />
                  <span>All Equipment</span>
                </div>
                <div className="feature-item">
                  <FontAwesomeIcon icon={faCheck} className="check-icon" />
                  <span>24/7 Support</span>
                </div>
              </div>
              <button className="purchase-btn">
                Purchase Plan
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlansSection;

