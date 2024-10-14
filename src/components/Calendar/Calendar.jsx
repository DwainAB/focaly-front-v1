// components/Calendar/Calendar.jsx
import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Calendar.css';

const CustomCalendar = ({ onDateChange }) => {
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  const [errorMessage, setErrorMessage] = useState('');

  const handleDateChange = (range) => {
    const startDate = range[0];
    const endDate = range[1];

    const differenceInTime = endDate - startDate;
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);

    if (differenceInDays >= 4) {
      setDateRange(range);
      setErrorMessage('');
      if (onDateChange) {
        onDateChange(range);
      }
    } else {
      setErrorMessage('Veuillez sélectionner une plage de 4 jours minimum.');
    }
  };

  const navigationLabel = ({ date, view }) => {
    if (view === 'month') {
      return `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
    }
    return null;
  };

  return (
    <div className="custom-calendar-container">
      <div className="calendar-inputs mb-3">
        <label htmlFor="start-date">Début de location :</label>
        <input
          type="text"
          id="start-date"
          value={dateRange[0].toLocaleDateString()}
          readOnly
          className="form-control mb-2"
        />
        <label htmlFor="end-date">Fin de location :</label>
        <input
          type="text"
          id="end-date"
          value={dateRange[1] ? dateRange[1].toLocaleDateString() : ''}
          readOnly
          className="form-control mb-2"
        />
      </div>
      <Calendar
        onChange={handleDateChange}
        value={dateRange}
        selectRange={true}
        minDate={new Date()}
        navigationLabel={navigationLabel} 
        prev2Label={null} 
        next2Label={null} 
        className="custom-calendar"
      />
      {errorMessage && <p className="text-danger mt-2">{errorMessage}</p>}
    </div>
  );
};

export default CustomCalendar;