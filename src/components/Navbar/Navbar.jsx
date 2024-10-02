import React, { useState } from 'react';
import './Navbar.css';
import logo from "../../Assets/FOCALY - LOGOTYPE N.png";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  //Gère l'ouverture est la fermeture de la navbar
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className="navbar">

      <div className="navbar-logo logo-desktop">
       <Link to="/"> <img src={logo} alt="Logo" /></Link>
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
        <span className="material-symbols-outlined">search</span>
        <span className="material-symbols-outlined">shopping_basket</span>
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

      <div className="navbar-logo logo-mobil">
           <Link to="/"><img src={logo} alt="Logo" /></Link> 
        </div>

        <div className="navbar-icons icon-mobil">
            <span className="material-symbols-outlined">search</span>
            <span className="material-symbols-outlined">shopping_basket</span>
        </div>


    </nav>
  );
};

export default Navbar;