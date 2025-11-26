import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/home/Footer';
import MapSection from '../components/home/MapSection';
import SEO from '../components/SEO';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faMapMarkerAlt,
  faPhone,
  faEnvelope,
  faClock
} from '@fortawesome/free-solid-svg-icons';
import './ContactUsPage.css';

const ContactUsPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
  };

      const contactInfo = [
        {
          icon: faMapMarkerAlt,
          title: 'Address',
          details: ['#17-3-764, Zafar Road', 'Yakutpura Hyderabad', 'Telangana-500023']
        },
        {
          icon: faPhone,
          title: 'Phone',
          details: ['+91 9701858786', '+91 8885055127']
        },
        {
          icon: faEnvelope,
          title: 'Email',
          details: ['admin@fitnessalive.gymorg.com']
        },
        {
          icon: faClock,
          title: 'Hours',
          details: ['Monday - Saturday: 10:00 AM - 2:00 PM', 'Sunday: Closed']
        }
      ];

  return (
    <div className="contact-page">
      <SEO 
        title="Contact Us - Fitness Alive Gym | Get in Touch"
        description="Contact Fitness Alive Gym in Hyderabad. Visit us at Yakutpura or Madanapet locations. Call +91 9701858786 or email admin@fitnessalive.gymorg.com. We're here to help you on your fitness journey."
        keywords="contact fitness alive gym, gym contact hyderabad, gym phone number hyderabad, gym address yakutpura, gym location madanapet"
      />
      <Header />
      
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="container">
          <h1 className="contact-hero-title">CONTACT US</h1>
          <p className="contact-hero-subtitle">
            Get in touch with us. We're here to help you on your fitness journey.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section">
        <div className="container">
          <div className="contact-wrapper">
            {/* Contact Form */}
            <div className="contact-form-wrapper">
              <h2>SEND US A MESSAGE</h2>
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Your Name"
                      style={{
                        color: '#FFFFFF',
                        backgroundColor: '#000000',
                        border: '2px solid #FFFFFF'
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="your.email@example.com"
                      style={{
                        color: '#FFFFFF',
                        backgroundColor: '#000000',
                        border: '2px solid #FFFFFF'
                      }}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 123-4567"
                      style={{
                        color: '#FFFFFF',
                        backgroundColor: '#000000',
                        border: '2px solid #FFFFFF'
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <label>Subject *</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="What's this about?"
                      style={{
                        color: '#FFFFFF',
                        backgroundColor: '#000000',
                        border: '2px solid #FFFFFF'
                      }}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    placeholder="Tell us how we can help you..."
                    style={{
                      color: '#FFFFFF',
                      backgroundColor: '#000000',
                      border: '2px solid #FFFFFF'
                    }}
                  ></textarea>
                </div>
                <button type="submit" className="submit-button">
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Info - Below Form */}
            <div className="contact-info">
              <h2>GET IN TOUCH</h2>
              <p className="contact-intro">
                Have questions? Want to schedule a tour? We'd love to hear from you!
              </p>
              
              <div className="contact-info-grid">
                {contactInfo.map((info, index) => (
                  <div key={index} className="contact-info-card">
                    <div className="contact-info-icon">
                      <FontAwesomeIcon icon={info.icon} />
                    </div>
                    <div className="contact-info-card-content">
                      <h3>{info.title}</h3>
                      {info.details.map((detail, idx) => (
                        <p key={idx}>{detail}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="contact-map-section">
        <div className="container">
          <h2>FIND US</h2>
          <MapSection />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactUsPage;

