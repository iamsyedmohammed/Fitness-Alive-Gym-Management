import React, { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/home/Footer';
import SEO from '../components/SEO';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faDumbbell,
  faUsers,
  faTrophy,
  faHeart,
  faFire,
  faBullseye
} from '@fortawesome/free-solid-svg-icons';
import './AboutUsPage.css';

const AboutUsPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const values = [
    {
      icon: faHeart,
      title: 'Passion',
      description: 'We are passionate about fitness and helping you achieve your goals'
    },
    {
      icon: faBullseye,
      title: 'Excellence',
      description: 'We strive for excellence in everything we do'
    },
    {
      icon: faUsers,
      title: 'Community',
      description: 'Building a strong, supportive fitness community'
    },
    {
      icon: faTrophy,
      title: 'Results',
      description: 'Focused on delivering real, measurable results'
    }
  ];

  const milestones = [
    { year: '2020', title: 'Founded', description: 'Started our journey' },
    { year: '2021', title: '100 Members', description: 'Reached first milestone' },
    { year: '2022', title: 'Award Winner', description: 'Best Gym of the Year' },
    { year: '2024', title: '1000+ Members', description: 'Growing community' }
  ];

  return (
    <div className="about-page">
      <SEO 
        title="About Us - Fitness Alive Gym | Our Story & Mission"
        description="Learn about Fitness Alive Gym's journey, mission, and commitment to helping people achieve their fitness goals. Discover our values, milestones, and what makes us the best gym in Hyderabad."
        keywords="about fitness alive gym, gym history hyderabad, fitness mission, gym values, best gym hyderabad story"
      />
      <Header />
      
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-overlay"></div>
        <div className="container">
          <h1 className="about-hero-title">ABOUT GYM PRO</h1>
          <p className="about-hero-subtitle">
            Transforming lives through fitness, one workout at a time
          </p>
        </div>
      </section>

          {/* Mission Section */}
          <section className="mission-section">
            <div className="container">
              <div className="mission-content">
                <div className="mission-text">
                  <h2>OUR MISSION</h2>
                  <p className="mission-quote">
                    "How much do you want it? Ask yourself that question every single time you step into our gym."
                  </p>
                  <p>
                    We believe we help people for happier lives. At Fitness Alive Gym, we believe that fitness is not just about physical strength,
                    but about building confidence, discipline, and a better version of yourself.
                    Our mission is to provide a premium fitness experience that empowers individuals
                    to achieve their health and wellness goals.
                  </p>
                  <p>
                    We combine state-of-the-art equipment, expert trainers, and a supportive
                    community to create an environment where everyone can thrive and reach their
                    full potential.
                  </p>
                </div>
            <div className="mission-image">
              <img 
                src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Our Mission"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="container">
          <div className="section-header">
            <h2>OUR VALUES</h2>
            <p>What drives us every day</p>
          </div>
          <div className="values-grid">
            {values.map((value, index) => (
              <div key={index} className="value-card">
                <div className="value-icon-wrapper">
                  <FontAwesomeIcon icon={value.icon} />
                </div>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="timeline-section">
        <div className="container">
          <div className="section-header">
            <h2>OUR JOURNEY</h2>
            <p>Milestones that shaped us</p>
          </div>
          <div className="timeline">
            {milestones.map((milestone, index) => (
              <div key={index} className={`timeline-item ${index % 2 === 0 ? 'timeline-left' : 'timeline-right'}`}>
                <div className="timeline-content">
                  <div className="timeline-year">{milestone.year}</div>
                  <h3>{milestone.title}</h3>
                  <p>{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta">
        <div className="container">
          <h2>JOIN OUR FITNESS FAMILY</h2>
          <p>Be part of a community that supports and motivates you</p>
          <a href="/admin/login" className="cta-button">Get Started Today</a>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutUsPage;

