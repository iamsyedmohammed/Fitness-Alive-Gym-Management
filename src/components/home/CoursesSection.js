import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHeartbeat,
  faDumbbell,
  faRibbon,
  faWeightHanging,
  faHotTub,
  faRestroom,
  faParking,
  faVideo
} from '@fortawesome/free-solid-svg-icons';
import './CoursesSection.css';

const CoursesSection = () => {
  const courses = [
    { name: 'Cardio Blast', icon: faHeartbeat },
    { name: 'Dumbbell Gym', icon: faDumbbell },
    { name: 'Jump Rope', icon: faRibbon },
    { name: 'Lifting Weight', icon: faWeightHanging },
    { name: 'Steam Bath', icon: faHotTub },
    { name: 'Clean Washrooms', icon: faRestroom },
    { name: 'Parking', icon: faParking },
    { name: 'CCTV', icon: faVideo }
  ];

  return (
    <section className="courses-section" id="top-course">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Our Services</span>
          <h2 className="section-title">OUR SPECIALITIES</h2>
          <p className="section-subtitle">
            From cardio to strength training, we offer specialized programs designed to help you reach your fitness goals.
          </p>
        </div>
        <div className="courses-grid">
          {courses.map((course, index) => (
            <div key={index} className="course-card">
              <div className="course-icon-wrapper">
                <FontAwesomeIcon icon={course.icon} className="course-icon" />
              </div>
              <h3 className="course-name">{course.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;

