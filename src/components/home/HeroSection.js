import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowRight,
  faFire,
  faChevronLeft,
  faChevronRight,
  faCalendarAlt,
  faMapMarkerAlt,
  faStar
} from '@fortawesome/free-solid-svg-icons';
import './HeroSection.css';

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      bgImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      mainImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
    },
    {
      bgImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      mainImage: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
    },
    {
      bgImage: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      mainImage: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
    },
    {
      bgImage: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      mainImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="hero-section" id="home">
      <div className="hero-background">
        {slides.map((slide, index) => (
          <img 
            key={index}
            src={slide.bgImage}
            alt={`Gym Hero ${index + 1}`}
            className={`hero-bg-image ${index === currentSlide ? 'active' : ''}`}
          />
        ))}
        <div className="hero-overlay"></div>
      </div>
      <div className="hero-content">
        <div className="hero-text">
          <div className="hero-badge">
            <FontAwesomeIcon icon={faFire} />
            <span>PREMIUM FITNESS EXPERIENCE</span>
          </div>
          <h1 className="hero-title">
            Real Fitness Depends on Exercise.
            <br />
            <span className="gradient-text">Shape your body well.</span>
          </h1>
          <p className="hero-subtitle">
            Your journey to a stronger, healthier you starts here. Transform your body, boost your confidence, and achieve the results you've always wanted.
          </p>
          <div className="hero-buttons">
            <Link to="/admin/login" className="btn-primary">
              Start Your Journey
              <FontAwesomeIcon icon={faArrowRight} className="btn-icon" />
            </Link>
            <Link to="/#features" className="btn-secondary">
              Explore Features
            </Link>
          </div>
            <div className="hero-stats">
              <div className="hero-stat-item">
                <FontAwesomeIcon icon={faCalendarAlt} className="stat-icon" />
                <div className="stat-content">
                  <div className="stat-value">10+</div>
                  <div className="stat-label">Years</div>
                </div>
              </div>
              <div className="hero-stat-item">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="stat-icon" />
                <div className="stat-content">
                  <div className="stat-value">2</div>
                  <div className="stat-label">Locations</div>
                </div>
              </div>
              <div className="hero-stat-item">
                <FontAwesomeIcon icon={faStar} className="stat-icon" />
                <div className="stat-content">
                  <div className="stat-value">4.5</div>
                  <div className="stat-label">Star</div>
                </div>
              </div>
            </div>
        </div>
        <div className="hero-image-container">
          <div className="hero-image-wrapper">
            <div className="hero-slideshow">
              {slides.map((slide, index) => (
                <div 
                  key={index}
                  className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
                >
                  <img 
                    src={slide.mainImage}
                    alt={`Fitness ${index + 1}`}
                    className="hero-main-image"
                  />
                  <div className="image-overlay"></div>
                </div>
              ))}
            </div>
            <button className="slide-btn slide-btn-prev" onClick={prevSlide} aria-label="Previous slide">
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <button className="slide-btn slide-btn-next" onClick={nextSlide} aria-label="Next slide">
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
            <div className="slide-indicators">
              {slides.map((_, index) => (
                <button
                  key={index}
                  className={`slide-indicator ${index === currentSlide ? 'active' : ''}`}
                  onClick={() => setCurrentSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

