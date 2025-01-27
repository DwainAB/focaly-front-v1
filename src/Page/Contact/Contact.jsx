import React, { useState } from 'react';
import './Contact.css';

const Contact = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [orderNumber, setOrderNumber] = useState('');
    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !email || !subject || !message) {
            setErrorMessage('Veuillez remplir tous les champs obligatoires.');
            return;
        }

        setIsLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const response = await fetch('https://focaly-service.in/public/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    email,
                    subject,
                    orderNumber,
                    message
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Une erreur est survenue');
            }

            setSuccessMessage('Message envoyé avec succès !');
            setName('');
            setEmail('');
            setSubject('');
            setOrderNumber('');
            setMessage('');
            
        } catch (error) {
            console.error('Erreur:', error);
            setErrorMessage('Une erreur est survenue lors de l\'envoi du message. Veuillez réessayer.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="contact-container">
            <div className="contact-card">
                <div className="contact-header">
                    <h1 className="contact-title">Contactez-nous</h1>
                    <p className="contact-subtitle">
                        Nous sommes ici pour vous aider. Notre service clientèle est disponible 
                        du lundi au dimanche : de 8h à 20h30.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="contact-form-client">
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="name">Nom</label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Votre nom"
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">E-mail</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Votre e-mail"
                                required
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="subject">Sujet</label>
                            <select
                                id="subject"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                required
                                disabled={isLoading}
                            >
                                <option value="">Sélectionnez un sujet</option>
                                <option value="product">Produit</option>
                                <option value="order">Commande</option>
                                <option value="partnership">Partenariat</option>
                                <option value="other">Autre</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="orderNumber">
                                Numéro de commande (optionnel)
                            </label>
                            <input
                                type="text"
                                id="orderNumber"
                                value={orderNumber}
                                onChange={(e) => setOrderNumber(e.target.value)}
                                placeholder="Votre numéro de commande"
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="message">Message</label>
                        <textarea
                            id="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Votre message"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="submit-button"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <span className="loading-spinner"></span>
                                Envoi en cours...
                            </>
                        ) : 'Envoyer le message'}
                    </button>

                    {errorMessage && (
                        <div className="error-message">
                            {errorMessage}
                        </div>
                    )}
                    
                    {successMessage && (
                        <div className="success-message">
                            {successMessage}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default Contact;