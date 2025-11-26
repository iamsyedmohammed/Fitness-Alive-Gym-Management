import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import './DateRangePicker.css';

const DateRangePicker = ({ value, onChange, placeholder = "Date Range" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [nextMonth, setNextMonth] = useState(new Date(new Date().setMonth(new Date().getMonth() + 1)));
  const [tempStartDate, setTempStartDate] = useState(null);
  const [tempEndDate, setTempEndDate] = useState(null);
  const pickerRef = useRef(null);

  useEffect(() => {
    if (value) {
      const dates = value.split(' & ');
      if (dates.length === 2) {
        const start = parseDate(dates[0]);
        const end = parseDate(dates[1]);
        if (start && end) {
          setStartDate(start);
          setEndDate(end);
          setTempStartDate(start);
          setTempEndDate(end);
        }
      }
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const parseDate = (dateString) => {
    if (!dateString) return null;
    const parts = dateString.trim().split('-');
    if (parts.length === 3) {
      const day = parseInt(parts[0]);
      const month = parseInt(parts[1]) - 1;
      const year = parseInt(parts[2]);
      return new Date(year, month, day);
    }
    return null;
  };

  const formatDate = (date) => {
    if (!date) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    // Add days from previous month
    const prevMonth = new Date(year, month - 1, 0);
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonth.getDate() - i),
        isCurrentMonth: false,
      });
    }
    // Add days from current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true,
      });
    }
    // Add days from next month to fill the grid
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
      });
    }
    return days;
  };

  const handleDateClick = (date) => {
    if (!tempStartDate || (tempStartDate && tempEndDate)) {
      setTempStartDate(date);
      setTempEndDate(null);
    } else if (tempStartDate && !tempEndDate) {
      if (date < tempStartDate) {
        setTempEndDate(tempStartDate);
        setTempStartDate(date);
      } else {
        setTempEndDate(date);
      }
    }
  };

  const handleApply = () => {
    if (tempStartDate && tempEndDate) {
      setStartDate(tempStartDate);
      setEndDate(tempEndDate);
      const formatted = `${formatDate(tempStartDate)} & ${formatDate(tempEndDate)}`;
      onChange(formatted);
      setIsOpen(false);
    }
  };

  const handleCancel = () => {
    setTempStartDate(startDate);
    setTempEndDate(endDate);
    setIsOpen(false);
  };

  const navigateMonth = (direction, isNextMonth = false) => {
    const baseDate = isNextMonth ? nextMonth : currentMonth;
    const newDate = new Date(baseDate);
    newDate.setMonth(newDate.getMonth() + direction);
    
    if (isNextMonth) {
      setNextMonth(newDate);
    } else {
      setCurrentMonth(newDate);
      // Keep next month one month ahead
      const newNextMonth = new Date(newDate);
      newNextMonth.setMonth(newNextMonth.getMonth() + 1);
      setNextMonth(newNextMonth);
    }
  };

  const isDateInRange = (date) => {
    if (!tempStartDate || !tempEndDate) return false;
    return date >= tempStartDate && date <= tempEndDate;
  };

  const isDateSelected = (date) => {
    if (!tempStartDate && !tempEndDate) return false;
    const dateStr = formatDate(date);
    const startStr = formatDate(tempStartDate);
    const endStr = tempEndDate ? formatDate(tempEndDate) : null;
    return dateStr === startStr || dateStr === endStr;
  };

  const getMonthName = (date) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[date.getMonth()];
  };

  const displayValue = startDate && endDate 
    ? `${formatDate(startDate)} & ${formatDate(endDate)}`
    : value || '';

  return (
    <div className="date-range-picker" ref={pickerRef}>
      <div className="date-range-input-wrapper">
        <input
          type="text"
          value={displayValue}
          placeholder={placeholder}
          readOnly
          onClick={() => setIsOpen(!isOpen)}
          className="date-range-input"
        />
        <FontAwesomeIcon icon={faCalendarAlt} className="calendar-icon" />
      </div>

      {isOpen && (
        <div className="date-range-calendar">
          <div className="calendar-row">
            <div className="calendar-month">
              <div className="calendar-header">
                <button
                  type="button"
                  onClick={() => navigateMonth(-1, false)}
                  className="calendar-nav-btn"
                >
                  <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                <span className="calendar-month-year">
                  {getMonthName(currentMonth)} {currentMonth.getFullYear()}
                </span>
                <button
                  type="button"
                  onClick={() => navigateMonth(1, false)}
                  className="calendar-nav-btn"
                >
                  <FontAwesomeIcon icon={faChevronRight} />
                </button>
              </div>
              <div className="calendar-grid">
                <div className="calendar-weekdays">
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                    <div key={day} className="calendar-weekday">{day}</div>
                  ))}
                </div>
                <div className="calendar-days">
                  {getDaysInMonth(currentMonth).map((dayObj, idx) => {
                    const isInRange = isDateInRange(dayObj.date);
                    const isSelected = isDateSelected(dayObj.date);
                    const isToday = formatDate(dayObj.date) === formatDate(new Date());
                    
                    return (
                      <div
                        key={idx}
                        className={`calendar-day ${!dayObj.isCurrentMonth ? 'other-month' : ''} ${isInRange ? 'in-range' : ''} ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
                        onClick={() => handleDateClick(dayObj.date)}
                      >
                        {dayObj.date.getDate()}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="calendar-month">
              <div className="calendar-header">
                <button
                  type="button"
                  onClick={() => navigateMonth(-1, true)}
                  className="calendar-nav-btn"
                >
                  <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                <span className="calendar-month-year">
                  {getMonthName(nextMonth)} {nextMonth.getFullYear()}
                </span>
                <button
                  type="button"
                  onClick={() => navigateMonth(1, true)}
                  className="calendar-nav-btn"
                >
                  <FontAwesomeIcon icon={faChevronRight} />
                </button>
              </div>
              <div className="calendar-grid">
                <div className="calendar-weekdays">
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                    <div key={day} className="calendar-weekday">{day}</div>
                  ))}
                </div>
                <div className="calendar-days">
                  {getDaysInMonth(nextMonth).map((dayObj, idx) => {
                    const isInRange = isDateInRange(dayObj.date);
                    const isSelected = isDateSelected(dayObj.date);
                    const isToday = formatDate(dayObj.date) === formatDate(new Date());
                    
                    return (
                      <div
                        key={idx}
                        className={`calendar-day ${!dayObj.isCurrentMonth ? 'other-month' : ''} ${isInRange ? 'in-range' : ''} ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
                        onClick={() => handleDateClick(dayObj.date)}
                      >
                        {dayObj.date.getDate()}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="calendar-actions">
            <div className="date-inputs-row">
              <div className="date-input-group">
                <label>From</label>
                <input
                  type="text"
                  value={tempStartDate ? formatDate(tempStartDate) : ''}
                  placeholder="DD-MM-YYYY"
                  readOnly
                  className="date-display-input"
                />
                <FontAwesomeIcon icon={faCalendarAlt} className="date-input-icon" />
              </div>
              <div className="date-input-group">
                <label>To</label>
                <input
                  type="text"
                  value={tempEndDate ? formatDate(tempEndDate) : ''}
                  placeholder="DD-MM-YYYY"
                  readOnly
                  className="date-display-input"
                />
                <FontAwesomeIcon icon={faCalendarAlt} className="date-input-icon" />
              </div>
            </div>
            <div className="calendar-buttons">
              <button
                type="button"
                onClick={handleCancel}
                className="calendar-cancel-btn"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApply}
                className="calendar-apply-btn"
                disabled={!tempStartDate || !tempEndDate}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;

