// components/Calendar/Calendar.jsx
import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Calendar.css';

const CustomCalendar = ({ onDateChange, price, product }) => {
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  const [errorMessage, setErrorMessage] = useState('');
  const [quantity, setQuantity] = useState(1)
  const [daysDifference, setDaysDifference] = useState(0); // Ajout de l'état pour la différence de jours

  const handleDateChange = (range) => {
    const startDate = range[0];
    const endDate = range[1];

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    const differenceInTime = endDate - startDate;
    const differenceInDays = differenceInTime / (1000 * 3600 * 24) + 1;
    setDaysDifference(differenceInDays);

    if (differenceInDays >= 4) {
      setDateRange(range);
      setDaysDifference(differenceInDays);  
      setErrorMessage('');

            const selectedDates = {
              debut: startDate.toISOString().split('T')[0],
              fin: endDate.toISOString().split('T')[0]
            };
            


      if (onDateChange) {
        onDateChange({ range, quantity, daysDifference: differenceInDays});
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

  const btnIncr = () =>{
     if (quantity < product.quantity) {
       setQuantity( quantity + 1)
       if (dateRange[0] && dateRange[1]) {
         onDateChange({range: dateRange, quantity: quantity + 1, daysDifference: daysDifference});
       }
     }
  }

  const btnDecr = () =>{

     if(quantity > 1){
      setQuantity( quantity - 1)
      if (dateRange[0] && dateRange[1]) {
        onDateChange({range: dateRange, quantity: quantity - 1, daysDifference: daysDifference});
      }
     }
  }


  return (
    <div className="custom-calendar-container">
      <p className='subtitle-calendar'>Chosissez vos dates de location (4jours minimum) </p>
      <div className='container-quantity'>
        <p>Quantité :</p>
        <div className="container-quantity-btn">
          <button onClick={btnDecr}>-</button>
          <p>{quantity}</p>
          <button onClick={btnIncr}>+</button>
        </div>
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
      {price === 0 ? (
        <p className='price'>Prix total (TTC): {product.price * quantity}€</p>
      ) : (
        <p className='price'>Prix total (TTC): {price}€</p>
      )}

      {errorMessage && <p className="text-danger mt-2">{errorMessage}</p>}
    </div>
  );
};

export default CustomCalendar;