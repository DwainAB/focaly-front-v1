import React from 'react';
import { Container, Row, Col, Button, Image, Card, Form } from 'react-bootstrap';
import './Cart.css';  
import Test from "../../Assets/FOCALY - LOGOTYPE N.png"

const Cart = () => {
  const [cartItems, setCartItems] = React.useState([]);

  React.useEffect(() => {
    const items = JSON.parse(localStorage.getItem('cartItems'));
    if (items) {
      setCartItems(items);
    }
  }, []);

  const handleRemoveItem = (index) => {
    const updatedItems = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedItems);
    localStorage.setItem('cartItems', JSON.stringify(updatedItems));
  };

  console.log(cartItems);


  return (
    <>
      <h1 className='title-shopping-cart'>Panier</h1>
      <div className="container-shopping-cart">

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
                    <p>Début de la location : {item.startDate}</p>
                    <p>Fin de la location : {item.endDate}</p>
                    <p>Unités : {item.quantity}</p>
                  </div>
                </div>
                <div className="container-days-cart">
                  <p>{item.daysDifference}</p>
                  <p onClick={() => handleRemoveItem(index)}>Supprimer</p> {/* Ajout de la fonction de suppression */}
                </div>
                <div className="container-price-cart">
                  <p>{item.price}€</p>
                </div>
              </div>
            ))}

          </div>

        </div>

        <div className="container-shopping-cart-price">

          <div className="price">
            <p>Total</p>
            <p>108,00€</p>
          </div>

          <p className='taxe-price'>Taxes incluses. Frais d'expédition calculés à l'étape de paiement.</p>
          <textarea placeholder='Note de commande' as="textarea" rows={3} resize="vertical"></textarea>
          <div className='container-button-price'><button className='button-paiement'>Passer la commande</button></div>
        </div>


      </div>
    </>
  );
};

export default Cart;