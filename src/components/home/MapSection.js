import React from 'react';
import './MapSection.css';

const MapSection = () => {
  return (
    <div className="map-section">
      <iframe 
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d60928.84963719775!2d78.4131410486328!3d17.361177600000026!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb983d00053169%3A0xde7d7c621237e97d!2sFitness%20Alive!5e0!3m2!1sen!2sin!4v1764061553436!5m2!1sen!2sin" 
        width="100%" 
        height="450" 
        style={{ border: 0 }} 
        allowFullScreen="" 
        loading="lazy" 
        referrerPolicy="no-referrer-when-downgrade"
        title="Fitness Alive Gym Location"
      ></iframe>
    </div>
  );
};

export default MapSection;

