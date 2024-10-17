import React, { useState, useEffect } from 'react';
import './Navbar.css';
import logo from "../../Assets/FOCALY - LOGOTYPE N.png";
import { Link } from "react-router-dom";
import { apiService } from '../API/Api';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [cartItemCount, setCartItemCount] = useState(0);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchTerm('')
  };

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchResults([]); // Réinitialiser les résultats si le terme est vide
      return;
    }

    apiService.getProductsBySearch(searchTerm)
      .then(data => {
        console.log('Données reçues du produit :', data);
        setSearchResults(data);
      })
      .catch(error => console.error('Erreur lors du chargement du produit :', error));
  }, [searchTerm]);

  useEffect(() => {
    if (isSearchOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const updateCartCount = () => {
      const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
      setCartItemCount(cartItems.length); 
    };
  
    updateCartCount();
  
    window.addEventListener('storage', updateCartCount);
  
    return () => {
      window.removeEventListener('storage', updateCartCount);
    };
  }, []);
  
  useEffect(() => {
    const interval = setInterval(() => {
      const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
      setCartItemCount(cartItems.length);
    }, 1000); 
  
    return () => clearInterval(interval); 
  }, []);
  

  return (
    <nav className="navbar">
      <div className="navbar-logo logo-desktop">
        <Link to="/"><img src={logo} alt="Logo" /></Link>
      </div>

      <div className={`navbar-links ${isOpen ? 'active' : ''}`}>
        <Link to="/collection/cameras-embarquée">Caméras Embarquées</Link>
        <Link to="/collection/appareils-photos">Appareils Photos</Link>
        <Link to="/collection/drones">Drones</Link>
        <Link to="/collection/accessoires">Accessoires</Link>
        <Link to="/collection/pack">Pack</Link>
        <Link to="/collection/professionnels">Pour les professionnels</Link>
      </div>

      <div className="navbar-icons">
        <span className="material-symbols-outlined" onClick={toggleSearch}>search</span>
        <Link to="/panier" className="shopping-cart-container">
          <span style={{ color: "#1D1D1B" }} className="material-symbols-outlined">
            shopping_basket
            {cartItemCount > 0 && (
              <div className="notification-dot">
                {cartItemCount} 
              </div>
            )}
          </span>
        </Link>    
        </div>

      <div className="hamburger" onClick={toggleMenu}>
        <span className="material-symbols-outlined">menu</span>
      </div>

      <div className={`slide-menu ${isOpen ? 'show' : ''}`}>
        <div className="close-icon" onClick={closeMenu}>
          <span className="material-symbols-outlined">close</span>
        </div>
        <div className="slide-menu-links">
          <Link to="/collection/cameras-embarquée" onClick={closeMenu}>Caméras Embarquées</Link>
          <Link to="/collection/appareils-photos" onClick={closeMenu}>Appareils Photos</Link>
          <Link to="/collection/drones" onClick={closeMenu}>Drones</Link>
          <Link to="/collection/accessoires" onClick={closeMenu}>Accessoires</Link>
          <Link to="/collection/pack" onClick={closeMenu}>Pack</Link>
          <Link to="/collection/professionnels" onClick={closeMenu}>Pour les professionnels</Link>
        </div>
      </div>

      <div className={`slide-search ${isSearchOpen ? 'show-search' : ''}`}>
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Rechercher..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>

        <div className="close-icon-search" onClick={closeSearch}>
          <span className="material-symbols-outlined">close</span>
        </div>

        <div className="search-results">
          {searchTerm.trim() === '' ? (
            <p>Rechercher votre produit</p>
          ) : searchResults.length > 0 ? (
            searchResults.map((product) => (
              <div key={product.id} className="container-search-results">
                <Link to={`http://localhost:3000/product/${product.id}`} onClick={closeSearch}>
                  <div className="search-result-item">
                    <img src={`http://localhost:8000/uploads/images/${product.images[0]}`} alt={product.title} /> 
                    <div className="search-result-item-text">
                      <p>{product.title}</p>
                      <p>A partir de {product.price} €</p>
                    </div>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <p>Aucun résultat trouvé</p>
          )}
        </div>
      </div>

      <div className="navbar-logo logo-mobil">
        <Link to="/"><img src={logo} alt="Logo" /></Link>
      </div>

      <div className="navbar-icons icon-mobil">
        <span className="material-symbols-outlined" onClick={toggleSearch}>search</span>
        <Link to="/panier" className="shopping-cart-container">
          <span style={{ color: "#1D1D1B" }} className="material-symbols-outlined">
            shopping_basket
            {cartItemCount > 0 && (
              <div className="notification-dot">
                {cartItemCount} 
              </div>
            )}
          </span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;