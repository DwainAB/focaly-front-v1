import React from 'react';
import { Link } from 'react-router-dom';
import './Cart.css';  
import LogoEmpty from "../../Assets/shopping-empty.png"
import { apiService } from '../API/Api';

const Cart = () => {
  const [cartItems, setCartItems] = React.useState([]);
  const [totalPrice, setTotalPrice] = React.useState('');
  const [accessoryItems, setAccessoryItems] = React.useState([]); // État pour stocker les accessoires
  const [productAccessories, setProductAccessories] = React.useState({});
  const [addedAccessoryQuantities, setAddedAccessoryQuantities] = React.useState({}); // Suivi des quantités d'accessoires

  React.useEffect(() => {
    const items = JSON.parse(localStorage.getItem('cartItems'));
    if (items) {
      console.log(items);
      setCartItems(items);
      let calculatePrice = 0;
      for (let i = 0; i < items.length; i++) {
        calculatePrice += items[i].price;      
      }
      setTotalPrice(calculatePrice.toFixed(2));
    }
  }, []);

  const handleRemoveItem = (index) => {
    const removedItem = cartItems[index];
    
    // Supprimer l'article du panier
    const updatedItems = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedItems);
    localStorage.setItem('cartItems', JSON.stringify(updatedItems));
  
    // Si c'est un accessoire, réinitialiser la quantité
    if (removedItem.product.category === 'accessories') {
      setAddedAccessoryQuantities(prev => ({
        ...prev,
        [removedItem.product.id]: 0 // Remettre la quantité à 0 pour l'accessoire supprimé
      }));
    }
  };
  

  // Fonction pour formater les dates au format JJ/MM/AAAA
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
      console.log(newAccessoryItems); 
    }
  }, [cartItems]); 

  const fetchProductAccessories = async (title, accessoryIds) => {
    try {
      // Envoyer tous les IDs dans un seul appel
      const accessories = await apiService.getAccessories({ ids: accessoryIds });
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
          // Incrémenter la quantité si la limite n'est pas atteinte
          existingAccessory.quantity += 1;
          existingAccessory.price = parseFloat(accessory.price) * existingAccessory.quantity * parentItem.daysDifference;

          const updatedCartItems = [...cartItems];
          updatedCartItems[existingAccessoryIndex] = existingAccessory;
          setCartItems(updatedCartItems);
          localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));

          const newTotalPrice = updatedCartItems.reduce((total, item) => total + item.price, 0);
          setTotalPrice(newTotalPrice.toFixed(2));

          // Mettre à jour l'état des quantités ajoutées
          setAddedAccessoryQuantities(prev => ({
            ...prev,
            [accessory.id]: existingAccessory.quantity
          }));
        }
      } else {
        // Ajouter un nouvel accessoire si pas encore dans le panier
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

        const newTotalPrice = updatedCartItems.reduce((total, item) => total + item.price, 0);
        setTotalPrice(newTotalPrice.toFixed(2));

        // Mettre à jour l'état des quantités ajoutées
        setAddedAccessoryQuantities(prev => ({
          ...prev,
          [accessory.id]: 1
        }));
      }
    }
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
                    <p>{item.daysDifference}</p>
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
              <p>{totalPrice}€</p>
            </div>
            <p className='taxe-price'>Taxes incluses. Frais d'expédition calculés à l'étape de paiement.</p>
            <textarea placeholder='Note de commande' as="textarea" rows={3} resize="vertical"></textarea>
            <div className='container-button-price'><button className='button-paiement'>Passer la commande</button></div>
          </div>
        )}
      </div>

      <div className="container-accessories">
        {cartItems.map((item, index) => (
          // Vérifiez si l'item est un produit principal avant d'afficher les accessoires
          item.product.category !== "accessories" && ( // Assurez-vous que ce n'est pas un accessoire
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
                          src={`http://localhost:8000/uploads/images/${accessory.images[0]}`}
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
