import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import './CTASection.css';

const CTASection = () => {
  return (
    <section className="cta-section" id="pricing">
      <div className="cta-background">
        <img 
          src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
          alt="CTA Background"
          className="cta-bg-image"
        />
        <div className="cta-overlay"></div>
      </div>
      <div className="container">
        <div className="cta-content">
          <h2>READY TO TRANSFORM YOUR LIFE?</h2>
          <p>Join thousands of members who are achieving their fitness goals every single day</p>
          <Link to="/admin/login" className="btn-cta">
            Start Your Transformation Today
            <FontAwesomeIcon icon={faArrowRight} className="btn-icon" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;

