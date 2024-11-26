import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Calendar.css';

const CustomCalendar = ({ onDateChange, price, product, productId }) => {
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  const [errorMessage, setErrorMessage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [daysDifference, setDaysDifference] = useState(0);
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [fullyBookedDates, setFullyBookedDates] = useState([]);

  // Ajoute 7 jours à la date de fin
  const addSevenDays = (date) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + 7);
    return newDate;
  };

  // Soustrait 1 jour à la date de début
  const subtractOneDay = (date) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() - 1);
    return newDate;
  };

  useEffect(() => {
    const quantityProduct = product.quantity;
    
    const getDateUnavailable = async () => {
      try {
        const response = await fetch(`https://focaly-service.in/public/api/product/${productId}/reservations`);
        if (!response.ok) {
          throw new Error(`Erreur lors de la récupération des dates : ${response.status}`);
        }
        const data = await response.json();
        const allUnavailableDates = [];

        data.reservations.forEach(reservation => {
          const startDate = new Date(reservation.startDate);
          const endDate = new Date(reservation.endDate);
          
          startDate.setDate(startDate.getDate());  // Inclure un jour après la date de début
          endDate.setDate(endDate.getDate() + 7);  // Inclure un jour après la date de fin

          for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
            allUnavailableDates.push(date.toISOString().split('T')[0]);
          }
        });

        //console.log("Toutes les dates indisponibles :", allUnavailableDates);
        
        // Fonction pour obtenir les dates totalement réservées
        const getFullyBookedDates = (allUnavailableDates, quantityProduct) => {
          const dateOccurrences = {};

          // Compter les occurrences de chaque date
          allUnavailableDates.forEach(date => {
            if (dateOccurrences[date]) {
              dateOccurrences[date]++;
            } else {
              dateOccurrences[date] = 1;
            }
          });

          // Filtrer les dates qui atteignent le nombre maximal de réservations
          const fullyBookedDates = Object.keys(dateOccurrences).filter(date => dateOccurrences[date] >= quantityProduct);
          //console.log("Dates totalement réservées :", fullyBookedDates);
          return fullyBookedDates;
        };

        // Obtenir les dates totalement réservées et mettre à jour l'état
        const fullyBooked = getFullyBookedDates(allUnavailableDates, quantityProduct);
        setFullyBookedDates(fullyBooked);

      } catch (error) {
        console.error(error);
      }
    };

    getDateUnavailable();
  }, [productId, product.quantity]);

  // Vérifie si une plage de dates sélectionnée chevauche les dates bloquées
  const isDateUnavailable = (date) => {
    const dateString = date.toISOString().split('T')[0];
    return fullyBookedDates.includes(dateString);
  };

  const handleDateChange = (range) => {
    const startDate = range[0];
    const endDate = range[1];

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    const differenceInTime = endDate - startDate;
    const differenceInDays = differenceInTime / (1000 * 3600 * 24) + 1;
    setDaysDifference(differenceInDays);

    if (differenceInDays >= 4) {
      if (isDateUnavailable(startDate) || isDateUnavailable(endDate)) {
        setErrorMessage('Les dates sélectionnées chevauchent des dates indisponibles. Veuillez choisir une autre plage.');
      } else {
        setDateRange(range);
        setDaysDifference(differenceInDays);
        setErrorMessage('');
        if (onDateChange) {
          onDateChange({ range, quantity, daysDifference: differenceInDays });
        }
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

  const btnIncr = () => {
    if (quantity < product.quantity) {
      setQuantity(quantity + 1);
      if (dateRange[0] && dateRange[1]) {
        onDateChange({ range: dateRange, quantity: quantity + 1, daysDifference: daysDifference });
      }
    }
  };

  const btnDecr = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
      if (dateRange[0] && dateRange[1]) {
        onDateChange({ range: dateRange, quantity: quantity - 1, daysDifference: daysDifference });
      }
    }
  };

  return (
    <div className="custom-calendar-container">
      <p className='subtitle-calendar'>Choisissez vos dates de location (4 jours minimum)</p>
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
        tileDisabled={({ date }) => isDateUnavailable(date)} // Désactive les dates totalement réservées
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
        <p className='price'>Prix total (TTC): {(product.price * quantity).toFixed(2)}€</p>
      ) : (
        <p className='price'>Prix total (TTC): {parseFloat(price).toFixed(2)}€</p>
      )}

      {errorMessage && <p className="text-danger mt-2">{errorMessage}</p>}
    </div>
  );
};

export default CustomCalendar;
