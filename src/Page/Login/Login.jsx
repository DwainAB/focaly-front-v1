import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Register from "../../components/Register/Register.jsx";
import Signup from "../../components/Signup/Signup.jsx";
import "./Login.css"

function Login() {
    const navigate = useNavigate();
    const [showRegister, setShowRegister] = useState(false);
    const [showSignup, setShowSignup] = useState(false);
    const [openCollapse, setOpenCollapse] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/dashboard');
        }
    }, [navigate]);

    const handleShowRegister = () => {
        setShowRegister(true);
        setShowSignup(false);
    };

    const handleShowSignup = () => {
        setShowSignup(true);
        setShowRegister(false);
    };

    const handleBack = () => {
        setShowRegister(false);
        setShowSignup(false);
    };

    const handleCollapseToggle = (index) => {
        setOpenCollapse(openCollapse === index ? null : index);
    };

    return (
        <>
            {!showRegister && !showSignup ? (
                <>
                    <h1 className="title-login">Inscrivez-vous ou connectez-vous</h1>
                    <p className="text-login">Pour retrouver rapidement toutes vos infos personnelles</p>
                    <div className="container-button-login">
                        <button onClick={handleShowRegister} >déjà un compte</button>
                        <button onClick={handleShowSignup} >pas encore de compte</button>
                    </div>
                    <div className="collapse-container">
                        <div className="collapse-item">
                            <div className="collapse-header-container">
                                <button onClick={() => handleCollapseToggle(0)} className="collapse-header">
                                    Nous contacter
                                </button>
                                <span className={`material-symbols-outlined ${openCollapse === 0 ? 'rotate' : ''}`}>
                                    expand_more
                                </span>
                            </div>
                            <div className={`collapse-content ${openCollapse === 0 ? 'open' : ''}`}>
                                <p>Nous sommes là pour vous aider !<br/> Pour toute question, suggestion ou besoin d'assistance, n'hésitez pas à nous contacter par email à contact@focaly.com. Notre équipe s'engage à vous fournir une réponse rapide et personnalisée.</p>
                            </div>
                        </div>
                        <div className="collapse-item">
                            <div className="collapse-header-container">
                                <button onClick={() => handleCollapseToggle(1)} className="collapse-header">
                                    A propos
                                </button>
                                <span className={`material-symbols-outlined ${openCollapse === 1 ? 'rotate' : ''}`}>
                                    expand_more
                                </span>
                            </div>
                            <div className={`collapse-content ${openCollapse === 1 ? 'open' : ''}`}>
                                <p>Focaly se positionne comme la société de référence en matière de location d'équipements de voyage pour les vacanciers à la recherche de qualité à prix abordable. Innovateurs dans l'âme, nous nous engageons à fournir un service exceptionnel tout en ayant un impact écologique positif. Notre mission est de rendre l'accès aux équipements de voyage de pointe simple, abordable et respectueux de l'environnement, pour que vous puissiez explorer le monde sans limites.</p>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    {showRegister && <Register onBack={handleBack} />}
                    {showSignup && <Signup onBack={handleBack} />}
                </>
            )}
        </>
    );
}

export default Login;
