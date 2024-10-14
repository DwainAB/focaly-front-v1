// Page/BookingPage/BookingPage.jsx
import React from 'react';
import CustomCalendar from '../../components/Calendar/Calendar';

const BookingPage = () => {
  const handleDateChange = (range) => {
    // Tu peux utiliser ce callback si tu souhaites gérer la plage de dates au niveau de BookingPage, sinon tu peux le laisser vide ou l'enlever.
    console.log('Plage de dates sélectionnée:', range);
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center">Réservation</h1>
      <p className="text-center">Veuillez choisir une date de début et une date de fin pour votre location (minimum 4 jours).</p>
      <CustomCalendar onDateChange={handleDateChange} />
    </div>
  );
};

export default BookingPage;