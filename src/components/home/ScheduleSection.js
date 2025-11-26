import React from 'react';
import './ScheduleSection.css';

const ScheduleSection = () => {
  const schedule = [
    { day: 'Monday', time: '6 am–11:30 pm' },
    { day: 'Tuesday', time: '6 am–11:30 pm' },
    { day: 'Wednesday', time: '6 am–11:30 pm' },
    { day: 'Thursday', time: '6 am–11:30 pm' },
    { day: 'Friday', time: '6 am–11:30 pm' },
    { day: 'Saturday', time: '6 am–11:30 pm' },
    { day: 'Sunday', time: '6–10:30 am' }
  ];

  return (
    <section className="schedule-section" id="schedule">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Our Timings</span>
          <h2 className="section-title">GYM OPERATING HOURS</h2>
          <p className="section-subtitle">
            Flexible hours to fit your busy lifestyle. We're here when you need us, with separate timings for your comfort.
          </p>
          <p className="schedule-note">
            <strong>Note:</strong> Separate timings available for Men's & Women's sections.
          </p>
        </div>
        <div className="schedule-table-wrapper">
          <table className="schedule-table">
            <thead>
              <tr>
                {schedule.map((item, index) => (
                  <th key={index}>{item.day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {schedule.map((item, index) => (
                  <td key={index} className="time-cell">
                    <span className="time-slot">{item.time}</span>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
          <div className="schedule-mobile">
            {schedule.map((item, index) => (
              <div key={index} className="schedule-mobile-item">
                <div className="schedule-mobile-day">{item.day}</div>
                <div className="schedule-mobile-time">
                  <span className="time-slot">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScheduleSection;

