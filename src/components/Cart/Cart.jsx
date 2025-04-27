import React from 'react';
import { Link } from 'react-router-dom';
import './Cart.css';  
import LogoEmpty from "../../Assets/shopping-empty.png"
import { apiService } from '../API/Api';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const [cartItems, setCartItems] = React.useState([]);
  const [totalPrice, setTotalPrice] = React.useState('');
  const [originalPrice, setOriginalPrice] = React.useState('');
  const [discountedPrice, setDiscountedPrice] = React.useState('');
  const [accessoryItems, setAccessoryItems] = React.useState([]); 
  const [productAccessories, setProductAccessories] = React.useState({});
  const [addedAccessoryQuantities, setAddedAccessoryQuantities] = React.useState({}); 
  const [comment, setComment] = React.useState('');
  const [promoCode, setPromoCode] = React.useState('');
  const [promoError, setPromoError] = React.useState('');
  const [promoSuccess, setPromoSuccess] = React.useState(null);
  const [promoName, setPromoName] = React.useState('');
  const [isPromoCodeInputDisabled, setIsPromoCodeInputDisabled] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    const items = JSON.parse(localStorage.getItem('cartItems'));
    if (items) {
      setCartItems(items);
      let calculatePrice = 0;
      for (let i = 0; i < items.length; i++) {
        calculatePrice += items[i].price;      
      }
      setOriginalPrice(calculatePrice.toFixed(2));
      setTotalPrice(calculatePrice.toFixed(2));
    }
  }, []);

  React.useEffect(() => {
    if (cartItems.length > 0) {
      const firstItem = cartItems[0];
      const { startDate, endDate, daysDifference } = firstItem;
      
      let newTotalPrice;
      if (promoSuccess) {
        if (promoSuccess.type === 'percentage') {
          const reduction = (parseFloat(originalPrice) * promoSuccess.amount) / 100;
          newTotalPrice = (parseFloat(originalPrice) - reduction).toFixed(2);
        } else if (promoSuccess.type === 'fixedDiscount') {
          newTotalPrice = (parseFloat(originalPrice) - promoSuccess.amount).toFixed(2);
          if (newTotalPrice < 0) newTotalPrice = '0.00';
        }
      } else {
        newTotalPrice = cartItems.reduce((total, item) => total + item.price, 0).toFixed(2);
      }
  
      localStorage.setItem('orderSummary', JSON.stringify({
        totalPrice: newTotalPrice,
        daysDifference,
        startDate,
        endDate,
        promoCode: promoSuccess ? promoSuccess.code : null,
        discount: promoSuccess ? {
          type: promoSuccess.type,
          amount: promoSuccess.amount
        } : null
      }));
    } else {
      localStorage.removeItem('orderSummary');
    }
  }, [cartItems, promoSuccess, originalPrice]);

  React.useEffect(() => {
    const storedPromoCode = localStorage.getItem('promoCode');
    if (storedPromoCode) {
      setPromoCode(storedPromoCode);
      handlePromoCodeSubmit(); // Appliquer le code promo
      setIsPromoCodeInputDisabled(true); // Désactiver l'input
    }
  }, []);

  const handlePromoCodeSubmit = async () => {
    if (!promoCode.trim()) {
      setPromoError('Veuillez entrer un code promo');
      return;
    }

    try {
      const response = await apiService.getPromoCodeByName(promoCode);
      if (response.message === 'Code promo non trouvé') {
        setPromoError('Code promo invalide');
        setPromoSuccess(null);
        setTotalPrice(originalPrice);
        // Supprimer le code promo du localStorage si invalide
        localStorage.removeItem('promoCodeData');
      } else {
        setPromoError('');
        setPromoSuccess(response);
        setPromoName(response.code);
        
        let newPrice;
        if (response.type === 'percentage') {
          const reduction = (parseFloat(originalPrice) * response.amount) / 100;
          newPrice = (parseFloat(originalPrice) - reduction).toFixed(2);
        } else if (response.type === 'fixedDiscount') {
          newPrice = (parseFloat(originalPrice) - response.amount).toFixed(2);
          if (newPrice < 0) newPrice = '0.00';
        }
        
        setTotalPrice(newPrice);
        setDiscountedPrice(newPrice);

        // Sauvegarder le code promo et ses données dans le localStorage
        const promoData = {
          code: response.code,
          type: response.type,
          amount: response.amount,
          discountedPrice: newPrice,
          originalPrice: originalPrice
        };
        localStorage.setItem('promoCodeData', JSON.stringify(promoData));
      }
    } catch (error) {
      setPromoError('Une erreur est survenue');
      setPromoSuccess(null);
      localStorage.removeItem('promoCodeData');
    }
};

  const handleRemoveItem = (index) => {
    const removedItem = cartItems[index];
    
    const updatedItems = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedItems);
    localStorage.setItem('cartItems', JSON.stringify(updatedItems));
    
    let newTotalPrice = updatedItems.reduce((total, item) => total + item.price, 0).toFixed(2);
    setOriginalPrice(newTotalPrice);
    
    if (promoSuccess) {
      if (promoSuccess.type === 'percentage') {
        const reduction = (parseFloat(newTotalPrice) * promoSuccess.amount) / 100;
        newTotalPrice = (parseFloat(newTotalPrice) - reduction).toFixed(2);
      } else if (promoSuccess.type === 'fixedDiscount') {
        newTotalPrice = (parseFloat(newTotalPrice) - promoSuccess.amount).toFixed(2);
        if (newTotalPrice < 0) newTotalPrice = '0.00';
      }
    }
    
    setTotalPrice(newTotalPrice);
    
    if (removedItem.product.category === 'accessories') {
      setAddedAccessoryQuantities(prev => ({
        ...prev,
        [removedItem.product.id]: 0
      }));
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const year = date.getFullYear();
    return `${day}/${month}/${year}`; 
  };

  React.useEffect(() => {
    if (cartItems.length > 0) {
      const newAccessoryItems = cartItems.map(item => ({
        title: item.product.title,
        accessories: item.product.accessories ? item.product.accessories.split(',').filter(id => id !== '').map(Number) : []
      }));
      setAccessoryItems(newAccessoryItems);
    }
  }, [cartItems]); 

  const fetchProductAccessories = async (title, accessoryIds) => {
    try {
      const accessories = await apiService.getAccessoriesBatch({ ids: accessoryIds });
      setProductAccessories(prev => ({
        ...prev,
        [title]: accessories
      }));
    } catch (error) {
      console.error("Erreur lors du chargement des accessoires:", error);
    }
  };

  React.useEffect(() => {
    if (accessoryItems.length > 0) {
      accessoryItems.forEach(item => {
        if (item.accessories && item.accessories.length > 0) {
          fetchProductAccessories(item.title, item.accessories);
        }
      });
    }
  }, [accessoryItems]);

  const handleAddAccessory = (accessory, parentProduct) => {
    const parentItem = cartItems.find(item => item.product.title === parentProduct);
    
    if (parentItem) {
      const existingAccessoryIndex = cartItems.findIndex(item => item.product.title === accessory.title);
      let existingAccessory = cartItems[existingAccessoryIndex];

      if (existingAccessory) {
        if (existingAccessory.quantity < accessory.quantity) {
          existingAccessory.quantity += 1;
          existingAccessory.price = parseFloat(accessory.price) * existingAccessory.quantity * parentItem.daysDifference;

          const updatedCartItems = [...cartItems];
          updatedCartItems[existingAccessoryIndex] = existingAccessory;
          setCartItems(updatedCartItems);
          localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));

          let newTotalPrice = updatedCartItems.reduce((total, item) => total + item.price, 0).toFixed(2);
          setOriginalPrice(newTotalPrice);
          
          if (promoSuccess) {
            if (promoSuccess.type === 'percentage') {
              const reduction = (parseFloat(newTotalPrice) * promoSuccess.amount) / 100;
              newTotalPrice = (parseFloat(newTotalPrice) - reduction).toFixed(2);
            } else if (promoSuccess.type === 'fixedDiscount') {
              newTotalPrice = (parseFloat(newTotalPrice) - promoSuccess.amount).toFixed(2);
              if (newTotalPrice < 0) newTotalPrice = '0.00';
            }
          }
          
          setTotalPrice(newTotalPrice);

          setAddedAccessoryQuantities(prev => ({
            ...prev,
            [accessory.id]: existingAccessory.quantity
          }));
        }
      } else {
        const newAccessoryItem = {
          product: accessory,
          startDate: parentItem.startDate,
          endDate: parentItem.endDate,
          daysDifference: parentItem.daysDifference,
          quantity: 1,
          price: parseFloat(accessory.price) * parentItem.daysDifference
        };

        const updatedCartItems = [...cartItems, newAccessoryItem];
        setCartItems(updatedCartItems);
        localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));

        let newTotalPrice = updatedCartItems.reduce((total, item) => total + item.price, 0).toFixed(2);
        setOriginalPrice(newTotalPrice);
        
        if (promoSuccess) {
          if (promoSuccess.type === 'percentage') {
            const reduction = (parseFloat(newTotalPrice) * promoSuccess.amount) / 100;
            newTotalPrice = (parseFloat(newTotalPrice) - reduction).toFixed(2);
          } else if (promoSuccess.type === 'fixedDiscount') {
            newTotalPrice = (parseFloat(newTotalPrice) - promoSuccess.amount).toFixed(2);
            if (newTotalPrice < 0) newTotalPrice = '0.00';
          }
        }
        
        setTotalPrice(newTotalPrice);

        setAddedAccessoryQuantities(prev => ({
          ...prev,
          [accessory.id]: 1
        }));
      }
    }
  };

  const handleCommentChange = (event) => {
    const newComment = event.target.value;
    setComment(newComment);

    if (newComment) {
      localStorage.setItem('comment', newComment);
    } else {
      localStorage.removeItem('comment');
    }
  };

  const handlePlaceOrder = () => {
    if (comment) {
      localStorage.setItem('comment', comment);
    } else {
      localStorage.removeItem('comment');
    }
    navigate('/paiement');
  };

  return (
    <>
      <h1 className='title-shopping-cart'>Panier</h1>
      <div className="container-shopping-cart">
        {cartItems.length === 0 ? ( 
          <div className='container-shopping-empty'>
            <img src={LogoEmpty} alt="" />
            <p className='empty-cart-message'>Votre panier est vide.</p>
            <Link to="/">Explorer nos produits</Link>
          </div>
        ) : (
          <div className="container-shopping-cart-product">
            <div className="container-title-info-cart">
              <p>Produit</p>
              <p>Jours de location</p>
              <p>Total</p>
            </div>
            <div className="container-list-product-cart">
              {cartItems.map((item, index) => (
                <div key={index} className="container-product-cart">
                  <div className="container-info-product">
                    <img src={`https://focaly-service.in/public/uploads/images/${item.product.images[0]}`} alt="" />
                    <div className="container-info-text">
                      <p className='title-info-text'>{item.product.title}</p>
                      <p className='price-info-text'>{parseFloat(item.price).toFixed(2)}€</p>
                      <p className='days-info-text'>{item.daysDifference} jours</p>
                      <p>Début de la location : {formatDate(item.startDate)}</p>
                      <p>Fin de la location : {formatDate(item.endDate)}</p>
                      <p>Unités : {item.quantity}</p>
                    </div>
                  </div>
                  <div className="container-days-cart">
                    <p>Jours :</p>
                    <p className='number-days'>{item.daysDifference}</p>
                    <p onClick={() => handleRemoveItem(index)}>Supprimer</p> 
                  </div>
                  <div className="container-price-cart">
                    <p>{parseFloat(item.price).toFixed(2)}€</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {cartItems.length > 0 && (
          <div className="container-shopping-cart-price">
            <div className="price">
              <p>Total</p>
              {promoSuccess ? (
                <div className="price-details">
                  <p className="original-price">{originalPrice}€</p>
                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: "center", gap: "10px" }}>
                    <p className="discount-info">
                      {promoSuccess.type === 'percentage' 
                        ? `(-${promoSuccess.amount}%)`
                        : `(-${promoSuccess.amount}€)`
                      }
                    </p>
                    <p className="discounted-price"> {totalPrice}€</p>
                  </div>
                </div>
              ) : (
                <p>{totalPrice}€</p>
              )}
            </div>
            <p className='taxe-price'>Taxes incluses. Frais d'expédition calculés à l'étape de paiement.</p>
            <textarea 
              placeholder='Note de commande' 
              rows={3} 
              value={comment} 
              onChange={handleCommentChange}
            />
            {promoName && (
              <p className="promo-name-message">{promoName}</p>
            )}
            <div className="promo-code-section">
              <div className="promo-code-input">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Entrer un code promo"
                  className="input-promo-code"
                  disabled={isPromoCodeInputDisabled}
                />
                <button 
                  onClick={handlePromoCodeSubmit}
                  className="button-promo-code"
                  disabled={isPromoCodeInputDisabled}
                >
                  Appliquer
                </button>
              </div>
              {promoError && (
                <p className="promo-error-message">{promoError}</p>
              )}
            </div>
            <div className='container-button-price'>
              <button onClick={handlePlaceOrder} className='button-paiement'>
                Passer la commande
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="container-accessories">
        {cartItems.map((item, index) => (
          item.product.category !== "accessories" && ( 
            <div className="accessory-item" key={index}>
              <h3 className='title-section-accessories'>
                Ajoutez vos accessoires en option <span className='title-accessory-bold'>({item.product.title})</span>:
              </h3>
              <div className="container-accessory">
                {productAccessories[item.product.title]?.map((accessory, accessoryIndex) => {
                  const isMaxQuantityReached = addedAccessoryQuantities[accessory.id] >= accessory.quantity;
                  return (
                    <div className="info-product" key={accessoryIndex}>
                      {accessory.images && accessory.images[0] && (
                        <img 
                          src={`https://focaly-service.in/public/uploads/images/${accessory.images[0]}`}
                          alt={accessory.title}
                          className="accessory-image"
                        />
                      )}
                      <h2 className="title-product">{accessory.title}</h2>
                      <p className="price-product">
                        À partir de {parseFloat(accessory.price).toFixed(2)}€
                      </p>
                      <button 
                        className={`button-add-to-cart ${isMaxQuantityReached ? 'button-disabled' : ''}`}
                        onClick={() => handleAddAccessory(accessory, item.product.title)}
                        disabled={isMaxQuantityReached}
                      >
                        {isMaxQuantityReached ? 'Quantité max atteinte' : 'Ajouter'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )
        ))}
      </div>
    </>
  );
};

export default Cart;