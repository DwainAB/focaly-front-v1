import React from 'react';
import { Link } from 'react-router-dom';
import './Cart.css';  
import LogoEmpty from "../../Assets/shopping-empty.png"

const Cart = () => {
  const [cartItems, setCartItems] = React.useState([]);
  const [totalPrice, setTotalPrice] = React.useState('');

  React.useEffect(() => {
    const items = JSON.parse(localStorage.getItem('cartItems'));
    if (items) {
      setCartItems(items);
      let calculatePrice = 0;
      for (let i = 0; i < items.length; i++) {
        calculatePrice += items[i].price;      
      }
      setTotalPrice(calculatePrice);
    }
  }, []);

  const handleRemoveItem = (index) => {
    const updatedItems = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedItems);
    localStorage.setItem('cartItems', JSON.stringify(updatedItems));
  };

  // Fonction pour formater les dates au format JJ/MM/AAAA
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const year = date.getFullYear();
    return `${day}/${month}/${year}`; 
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
                    <img src={`http://localhost:8000/uploads/images/${item.product.images[0]}`} alt="" />
                    <div className="container-info-text">
                      <p className='title-info-text'>{item.title}</p>
                      <p className='price-info-text'>{item.price}€</p>
                      <p className='days-info-text'>{item.daysDifference} jours</p>
                      <p>Début de la location : {formatDate(item.startDate)}</p>
                      <p>Fin de la location : {formatDate(item.endDate)}</p>
                      <p>Unités : {item.quantity}</p>
                    </div>
                  </div>
                  <div className="container-days-cart">
                    <p>{item.daysDifference}</p>
                    <p onClick={() => handleRemoveItem(index)}>Supprimer</p> 
                  </div>
                  <div className="container-price-cart">
                    <p>{item.price}€</p>
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
              <p>{totalPrice}€</p>
            </div>
            <p className='taxe-price'>Taxes incluses. Frais d'expédition calculés à l'étape de paiement.</p>
            <textarea placeholder='Note de commande' as="textarea" rows={3} resize="vertical"></textarea>
            <div className='container-button-price'><button className='button-paiement'>Passer la commande</button></div>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
