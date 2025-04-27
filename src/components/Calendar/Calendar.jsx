import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Calendar.css';
import ProductsService from '../../Services/Products';

const CustomCalendar = ({ onDateChange, price, product, productId }) => {
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  const [errorMessage, setErrorMessage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [quantityMax, setQuantityMax] = useState(product.global_stock);
  const [daysDifference, setDaysDifference] = useState(0);
  const [unavailableDates, setUnavailableDates] = useState([]);

  useEffect(() => {
    const getDateUnavailable = async () => {
      try {
        const data = await ProductsService.getDateUnavailable(productId);
        const allUnavailableDates = [];
  
        data.unavailable_periods.forEach(period => {
          const startDate = new Date(period.start_date);
          const endDate = new Date(period.end_date);
  
          startDate.setDate(startDate.getDate() - 1);
  
          for (let date = new Date(startDate); date < endDate; date.setDate(date.getDate() + 1)) {
            allUnavailableDates.push(date.toISOString().split('T')[0]);
          }
        });
  
        setUnavailableDates(allUnavailableDates);
        setQuantityMax(data.product.global_stock);
      } catch (error) {
        console.error("Erreur lors de la récupération des dates indisponibles:", error);
      }
    };
  
    getDateUnavailable();
  }, [productId]);

  const isDateUnavailable = (date) => {
    const dateString = date.toISOString().split('T')[0];
    return unavailableDates.includes(dateString) || isDateTodayOrTomorrow(new Date(date));
  };

  const calculateAvailableQuantity = (startDate, endDate) => {
    const dateCount = {};
    const start = new Date(startDate);
    const end = new Date(endDate);

    const formatDate = (date) => date.toISOString().split('T')[0];

    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      const dateString = formatDate(date);
      if (unavailableDates.includes(dateString)) {
        dateCount[dateString] = (dateCount[dateString] || 0) + 1;
      }
    }

    let maxCount = 0;
    for (const count of Object.values(dateCount)) {
      if (count > maxCount) {
        maxCount = count;
      }
    }

    const availableQuantity = product.global_stock - maxCount;
    setQuantityMax(availableQuantity);
  };

  const isDateTodayOrTomorrow = (date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    today.setHours(0, 0, 0, 0);
    tomorrow.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    return date.getTime() === today.getTime() || date.getTime() === tomorrow.getTime();
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
        setErrorMessage('');
        setQuantity(1);

        if (onDateChange) {
          onDateChange({
            range,
            quantity: 1,
            daysDifference: differenceInDays,
          });
        }
        calculateAvailableQuantity(startDate, endDate);
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
            <button combattere onClick={btnDecr}>-</button>
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
        tileDisabled={({ date }) => isDateUnavailable(date)}
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