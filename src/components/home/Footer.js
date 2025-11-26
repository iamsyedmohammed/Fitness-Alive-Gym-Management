import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDumbbell, faMapMarkerAlt, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import SocialIcons from './SocialIcons';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="home-footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <FontAwesomeIcon icon={faDumbbell} />
              <div>
                <h3>FITNESS ALIVE</h3>
                <p>We believe we help people for happier lives.</p>
              </div>
            </div>
            <p>Real Fitness Depends on Exercise. Shape your body well.</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <Link to="/">Home</Link>
            <Link to="/about">About Us</Link>
            <Link to="/gallery">Gallery</Link>
            <Link to="/blog">Blog</Link>
            <Link to="/contact">Contact</Link>
          </div>
          <div className="footer-section">
            <h4>Contact Info</h4>
            <div className="footer-contact-item">
              <FontAwesomeIcon icon={faMapMarkerAlt} />
              <a 
                href="https://maps.app.goo.gl/mYAnoukJcVLxT6ny8" 
                target="_blank" 
                rel="noopener noreferrer"
                className="footer-contact-link"
              >
                17-3-764, Zafar Road, Yakutpura Hyderabad, Telangana-500023
              </a>
            </div>
            <div className="footer-contact-item">
              <FontAwesomeIcon icon={faPhone} />
              <a href="tel:+919701858786" className="footer-contact-link">+91 9701858786</a>
            </div>
            <div className="footer-contact-item">
              <FontAwesomeIcon icon={faPhone} />
              <a href="tel:+918885055127" className="footer-contact-link">+91 8885055127</a>
            </div>
            <div className="footer-contact-item">
              <FontAwesomeIcon icon={faEnvelope} />
              <a href="mailto:admin@fitnessalive.gymorg.com" className="footer-contact-link">admin@fitnessalive.gymorg.com</a>
            </div>
          </div>
          <div className="footer-section">
            <h4>Follow Us</h4>
            <SocialIcons />
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 Fitness Alive Gym. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

