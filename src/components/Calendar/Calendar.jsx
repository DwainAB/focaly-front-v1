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

  // Fonction pour ajouter 4 jours à la date de fin
  const addFourDays = (date) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + 4);  // Ajoute 4 jours
    return newDate;
  };

  const subtractOneDay = (date) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() - 1);  // Soustrait 1 jour
    return newDate;
  };

  // Fetch unavailable dates and extend them by 4 days
  useEffect(() => {
    const quantityProduct = product.quantity
    const getDateUnavailable = async () => {
      try {
        const response = await fetch(`https://focaly-service.in/public/api/product/${productId}/reservations`);
        if (!response.ok) {
          throw new Error(`Erreur lors de la récupération des dates : ${response.status}`);
        }
        const data = await response.json();
        const dateUnavailable = data.reservations;
          
        //console.log("date :",dateUnavailable);
        
       // Utilisation d'un objet pour compter les occurrences
       const dateCountMap = {};

       dateUnavailable.forEach(range => {
        
        const key = `${range.startDate}|${range.endDate}`;
         
         if (dateCountMap[key]) {
           dateCountMap[key]++;
         } else {
           dateCountMap[key] = 1;
         }
       });
 
       const duplicateDates = Object.entries(dateCountMap)
         .filter(([, count]) => count > 1)
         .map(([key, count]) => {
          const [rawStartDate, rawEndDate] = key.split('|');

           const startDate = rawStartDate.split(' ')[0]; 
           const endDate = rawEndDate.split(' ')[0];     
            
           return {
             startDate,
             endDate,
             count
           };
         });
 
       //console.log("Dates identiques avec leur nombre d'occurrences :", duplicateDates);
       const unavailableDates = [];  // Tableau pour stocker les dates

      const checkOccurrences = (duplicateDates, quantityProduct) => {
        for (const date of duplicateDates) {
          if (date.count === quantityProduct) {
            console.log(`Produit non disponible à cette date : ${date.startDate} - ${date.endDate} car ${date.count} produits sur ${quantityProduct} sont déjà réservé .`);
            unavailableDates.push({
              startDate: subtractOneDay(date.startDate),  
              endDate: date.endDate
            });
            return true;
          }
        }
        
        if (unavailableDates.length === 0) {
          console.log("Un ou plusieurs produits sont encore disponibles.");
        }

        return unavailableDates;

      };
      
      const quantityProduct = product.quantity; 
      const result = checkOccurrences(duplicateDates, quantityProduct);
      //console.log("Résultat de la vérification :", result);
      console.log(unavailableDates);
      
        // Augmenter de 4 jours la date de fin pour chaque plage bloquée
        const extendedUnavailableDates = unavailableDates.map(range => {
          const extendedEndDate = addFourDays(range.endDate);  
          return {
            ...range,
            endDate: extendedEndDate.toISOString().split('T')[0]  
          };
        });

        setUnavailableDates(extendedUnavailableDates);
        //console.log("Dates bloquées étendues :", extendedUnavailableDates);
        
      } catch (error) {
        console.error(error);
      }
    };

    getDateUnavailable();
  }, [dateRange]); 

  // Fonction pour vérifier si une plage de dates sélectionnée chevauche les dates bloquées
  const isDateUnavailable = (startDate, endDate) => {
    return unavailableDates.some(range => {
      const startBlocked = new Date(range.startDate);
      const endBlocked = new Date(range.endDate);

      // Vérifie si la plage sélectionnée chevauche la plage bloquée
      return (startDate < endBlocked && endDate > startBlocked);
    });
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
      // Vérifier si la plage sélectionnée chevauche des dates bloquées
      if (isDateUnavailable(startDate, endDate)) {
        setErrorMessage('Les dates sélectionnées chevauchent des dates indisponibles. Veuillez choisir une autre plage.');
      } else {
        setDateRange(range);
        setDaysDifference(differenceInDays);
        setErrorMessage('');

        const selectedDates = {
          debut: startDate.toISOString().split('T')[0],
          fin: endDate.toISOString().split('T')[0]
        };

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
      <p className='subtitle-calendar'>Chosissez vos dates de location (4 jours minimum)</p>
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
        tileDisabled={({ date }) => isDateUnavailable(date, date)} // Désactive les dates dans la plage d'indisponibilité
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
