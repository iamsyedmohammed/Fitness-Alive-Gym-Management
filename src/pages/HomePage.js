import React, { useEffect } from 'react';
import Header from '../components/Header';
import HeroSection from '../components/home/HeroSection';
import FeaturesSection from '../components/home/FeaturesSection';
import CoursesSection from '../components/home/CoursesSection';
import ScheduleSection from '../components/home/ScheduleSection';
import TrainersSection from '../components/home/TrainersSection';
import PlansSection from '../components/home/PlansSection';
import StatsSection from '../components/home/StatsSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import GallerySection from '../components/home/GallerySection';
import CTASection from '../components/home/CTASection';
import MapSection from '../components/home/MapSection';
import Footer from '../components/home/Footer';
import SEO from '../components/SEO';
import './HomePage.css';

const HomePage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="home-page">
      <SEO 
        title="Fitness Alive Gym - Best Gym in Hyderabad | Yakutpura & Madanapet"
        description="Join thousands of members who have transformed their lives. Experience world-class facilities, expert trainers, and a supportive community dedicated to your success. Best gym in Hyderabad with locations in Yakutpura and Madanapet."
        keywords="gym hyderabad, fitness center hyderabad, gym yakutpura, gym madanapet, weight training, cardio, fitness training, personal trainer hyderabad, gym membership hyderabad, best gym hyderabad"
      />
      <Header />
      <HeroSection />
      <FeaturesSection />
      <CoursesSection />
      <ScheduleSection />
      <TrainersSection />
      <PlansSection />
      <StatsSection />
      <TestimonialsSection />
      <GallerySection />
      <CTASection />
      <section className="home-map-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Find Us</span>
            <h2 className="section-title">OUR LOCATION</h2>
            <p className="section-subtitle">
              Visit us at our convenient location in Yakutpura, Hyderabad. We're here to help you on your fitness journey.
            </p>
          </div>
          <MapSection />
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default HomePage;
