import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Calendar.css';

const CustomCalendar = ({ onDateChange, price, product, productId }) => {
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  const [errorMessage, setErrorMessage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [quantityMax, setQuantityMax] = useState();
  const [daysDifference, setDaysDifference] = useState(0);
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [fullyBookedDates, setFullyBookedDates] = useState([]);


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
          
          startDate.setDate(startDate.getDate());  
          endDate.setDate(endDate.getDate() + 7);  // On ajoute 7 jours après la date de fin

          for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
            allUnavailableDates.push(date.toISOString().split('T')[0]);
          }
        });

        //console.log("Toutes les dates indisponibles :", allUnavailableDates);
        setUnavailableDates(allUnavailableDates)
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

  const logBookedDatesInRange = (startDate, endDate) => {
    const dateCount = {}; 
    const start = new Date(startDate);
    const end = new Date(endDate);
  
    const formatDate = (date) => date.toISOString().split('T')[0];
  
    // Vérifie chaque date dans la plage
    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      const dateString = formatDate(date);  // Formate la date dans le bon format
  
      // Vérifie si cette date est réservée dans 'unavailableDates'
      for (let i = 0; i < unavailableDates.length; i++) {
        if (unavailableDates[i] === dateString) {
          // Compte les occurrences de la date
          if (dateCount[dateString]) {
            dateCount[dateString]++;
          } else {
            dateCount[dateString] = 1;
          }
        }
      }
    }
  
    // Trouver la date avec le plus grand nombre d'occurrences
    let maxDate = '';
    let maxCount = 0;
  
    for (const date in dateCount) {
      if (dateCount[date] > maxCount) {
        maxDate = date;
        maxCount = dateCount[date];
      }
    }
  
    // Calculer la soustraction entre la quantité et le nombre d'occurrences
    const availableQuantity = product.quantity - maxCount;
  
    //console.log("Date avec la plus grande occurrence :", maxDate);
    //console.log("Nombre d'occurrences :", maxCount);
    //console.log("Quantité restante disponible :", availableQuantity);
    setQuantityMax(availableQuantity)
  
    if (Object.keys(dateCount).length > 0) {
      console.log("Jours réservés entre ces dates : ", dateCount);
    } else {
      console.log("Aucune réservation dans cette plage.");
    }
  };
  
  

  const handleDateChange = (range) => {
    const startDate = range[0];
    const endDate = range[1];
  
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
  
    const differenceInTime = endDate - startDate;
    const differenceInDays = differenceInTime / (1000 * 3600 * 24) + 1;
    setDaysDifference(differenceInDays);
  
    // Modifiez la quantité seulement après avoir validé la plage de dates
    if (differenceInDays >= 4) {
      if (isDateUnavailable(startDate) || isDateUnavailable(endDate)) {
        setErrorMessage('Les dates sélectionnées chevauchent des dates indisponibles. Veuillez choisir une autre plage.');
      } else {
        setDateRange(range);
        setErrorMessage('');
        setQuantity(1);  // Assurez-vous que la quantité est réinitialisée à 1 ici
  
        if (onDateChange) {
          onDateChange({
            range,
            quantity: 1,  // Envoyer la quantité de manière explicite
            daysDifference: differenceInDays,
          });
        }
        logBookedDatesInRange(startDate, endDate);
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
    if (quantity < quantityMax) {
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
      {quantityMax && (
        <div className='container-quantity'>
          <p>Quantité :</p>
          <div className="container-quantity-btn">
            <button onClick={btnDecr}>-</button>
            <p>{quantity}</p>
            <button onClick={btnIncr}>+</button>
          </div>
        </div>
      )}
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
