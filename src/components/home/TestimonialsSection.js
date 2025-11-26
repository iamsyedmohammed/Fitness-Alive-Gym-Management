import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuoteLeft, faStar } from '@fortawesome/free-solid-svg-icons';
import './TestimonialsSection.css';

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: 'Rajesh Kumar',
      role: 'Member since 2022',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      rating: 5,
      text: 'Fitness Alive has transformed my life completely. The trainers are professional, equipment is top-notch, and the atmosphere is motivating. Best gym in Hyderabad!'
    },
    {
      name: 'Priya Sharma',
      role: 'Member since 2021',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      rating: 5,
      text: 'I love the separate timings for women. The facility is clean, well-maintained, and the staff is always helpful. Highly recommend to everyone!'
    },
    {
      name: 'Amit Patel',
      role: 'Member since 2023',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      rating: 5,
      text: 'The best investment I made for my health. Great trainers, excellent facilities, and flexible timings. The results speak for themselves!'
    }
  ];

  return (
    <section className="testimonials-section" id="testimonials">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">What Our Members Say</span>
          <h2 className="section-title">CLIENT TESTIMONIALS</h2>
          <p className="section-subtitle">
            Real experiences from our fitness community
          </p>
        </div>
        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              <div className="testimonial-quote">
                <FontAwesomeIcon icon={faQuoteLeft} />
              </div>
              <div className="testimonial-rating">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <FontAwesomeIcon key={i} icon={faStar} className="star-icon" />
                ))}
              </div>
              <p className="testimonial-text">{testimonial.text}</p>
              <div className="testimonial-author">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name}
                  className="author-image"
                />
                <div className="author-info">
                  <h4 className="author-name">{testimonial.name}</h4>
                  <p className="author-role">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

