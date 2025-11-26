import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faDumbbell, 
  faMobileAlt, 
  faBolt
} from '@fortawesome/free-solid-svg-icons';
import './FeaturesSection.css';

const FeaturesSection = () => {
  const features = [
    {
      icon: faDumbbell,
      title: 'Regular Exercise',
      description: 'Reading is to the mind what exercise is to the body.',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      icon: faMobileAlt,
      title: 'Training on the go',
      description: 'The hardest lift of all is lifting your butt off the couch.',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      icon: faBolt,
      title: 'Body Building Packages',
      description: 'Push through the pain on the other side is the reward.',
      image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    }
  ];

  return (
    <section className="features-section" id="features">
      <div className="container">
        <div className="section-header" id="we-offer">
          <span className="section-tag">What We Offer</span>
          <h2 className="section-title">OUR FEATURES</h2>
          <p className="section-subtitle">
            Discover what makes us different. Premium facilities, personalized training, and a commitment to your fitness journey.
          </p>
        </div>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-image-container">
                <img src={feature.image} alt={feature.title} />
                <div className="image-overlay"></div>
                <div className="feature-icon-wrapper">
                  <FontAwesomeIcon icon={feature.icon} className="feature-icon" />
                </div>
              </div>
              <div className="feature-content">
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
