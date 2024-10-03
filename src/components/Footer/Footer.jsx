import React, { useState } from 'react';
import { Tiktok, Instagram, Envelope } from 'react-bootstrap-icons';
import { FaCcVisa, FaCcMastercard, FaCcPaypal, FaApplePay, FaCcAmex } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        setErrorMessage(''); 
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            setErrorMessage('L\'email est invalide.'); 
        } else {
            console.log('Email soumis:', email);
            setEmail('');
        }
    };

    const copyEmailToClipboard = () => {
        navigator.clipboard.writeText('contact@focaly.com');
        alert('Email copié dans le presse-papiers !'); // Message de confirmation
    };

    return (
        <footer className="footer bg-light py-5">
            <div className="container">

                <div className="footer-newsletter newsletter-footer-mobile text-center mb-4">
                    <h1 className="footer-title">Inscrivez-vous à la newsletter pour bénéficier de 5% de réductions</h1>
                    <form onSubmit={handleSubmit} className="input-group mt-3">
                        <input
                            className="form-control"
                            placeholder="Email"
                            type="email"
                            value={email}
                            onChange={handleEmailChange}
                        />
                        <button className="btn text-white" style={{ backgroundColor: "#1D1D1B" }}>Go</button>
                    </form>
                    {errorMessage && <div className="text-danger mt-2">{errorMessage}</div>} 
                </div>

                <div className="row justify-content-between">
                    <div className="col-md-4 footer-newsletter newsletter-footer-desktop">
                        <h1 className="footer-title">Inscrivez-vous à la newsletter pour bénéficier de 5% de réductions</h1>
                        <form onSubmit={handleSubmit} className="input-group mt-3">
                            <input
                                className="form-control"
                                placeholder="Email"
                                type="email"
                                value={email}
                                onChange={handleEmailChange}
                            />
                            <button className="btn text-white" style={{ backgroundColor: "#F9973E" }}>Go</button>
                        </form>
                        {errorMessage && <div className="text-danger mt-2">{errorMessage}</div>} 
                    </div>

                    <div className="col-md-2">
                        <h2 className="title-h2-footer">Nos collections</h2>
                        <ul className="list-unstyled">
                            <li><a href="/AppareilsPhotos" className="footer-link">Nos Appareils Photos</a></li>
                            <li><a href="/drones" className="footer-link">Nos Drones</a></li>
                            <li><a href="/accessories" className="footer-link">Nos différents accessoires</a></li>
                            <li><a href="/packs" className="footer-link">Nos différents packs</a></li>
                            <li><a href="/cameras-embarquees" className="footer-link">Les caméras Embarquées</a></li>
                        </ul>
                    </div>

                    <div className="col-md-2">
                        <h2 className="title-h2-footer">Informations</h2>
                        <ul className="list-unstyled">
                            <li><a href="/conditions-generales" className="footer-link">Conditions générales de location</a></li>
                            <li><a href="/mentions-legales" className="footer-link">Mentions légales</a></li>
                            <li><a href="/faq" className="footer-link">F.A.Q</a></li>
                            <li><a href="/contact" className="footer-link">Contact</a></li>
                        </ul>
                    </div>
                    
                    <div className="col-md-3">
                        <h2 className="title-h2-footer">Focaly</h2>
                        <p>Chez Focaly, nous croyons en la puissance de la créativité. Nous mettons à votre disposition une vaste sélection d'équipements haut de gamme pour vous permettre de louer à moindre prix.</p>
                    </div>
                </div>

                <div className="container-icon-footer d-flex justify-content-between align-items-center mt-5">
                    <div className="container-social">
                        <a href="https://www.instagram.com/focaly_/" target="_blank" rel="noopener noreferrer">
                            <Instagram size={20} color="#C13584" /> {/* Couleur Instagram */}
                        </a>
                        <a href="https://www.tiktok.com/@focalyfr" target="_blank" rel="noopener noreferrer">
                            <Tiktok size={20} color="#69C9D0" /> {/* Couleur TikTok */}
                        </a>
                        <button onClick={copyEmailToClipboard} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                            <Envelope size={20} color="#0072C6" /> {/* Couleur de l'icône d'email */}
                        </button>
                    </div>

                    <p className="mb-0">&copy; 2024 Focaly</p>

                    <div className="container-method-pay d-flex gap-3">
                        <FaCcVisa size="2em" color="#1A1F71" className="payment-icon" /> 
                        <FaCcMastercard size="2em" color="#EB001B" className="payment-icon" /> 
                        <FaCcMastercard size="2em" color="#F79E1B" className="payment-icon" /> 
                        <FaCcPaypal size="2em" color="#0070BA" className="payment-icon" /> 
                        <FaApplePay size="2em" color="#000000" className="payment-icon" /> 
                        <FaCcAmex size="2em" color="#00B2A9" className="payment-icon" /> 
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;