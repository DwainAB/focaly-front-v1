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

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name || !email || !subject || !message) {
            setErrorMessage('Veuillez remplir tous les champs obligatoires.');
            return;
        }

        setErrorMessage('');
        setSuccessMessage('Message envoyé avec succès !');

        setName('');
        setEmail('');
        setSubject('');
        setOrderNumber('');
        setMessage('');
    };

    return (
        <div className="container my-5">
            <h1 className="text-center mb-4">Contactez-nous</h1>
            <p className="text-center mb-4">Nous sommes ici pour vous aider. Notre service clientèle est disponible du lundi au dimanche : de 8h à 20h30.</p>
            <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                    <label htmlFor="name">Nom</label>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Votre nom"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">E-mail</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Votre e-mail"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="subject">Sujet</label>
                    <select
                        className="form-control"
                        id="subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        required
                    >
                        <option value="">Sélectionnez un sujet</option>
                        <option value="produit">Produit</option>
                        <option value="commande">Commande</option>
                        <option value="presse">Presse</option>
                        <option value="autre">Autre</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="orderNumber">Numéro de commande (si applicable)</label>
                    <input
                        type="text"
                        className="form-control"
                        id="orderNumber"
                        value={orderNumber}
                        onChange={(e) => setOrderNumber(e.target.value)}
                        placeholder="Votre numéro de commande"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="message">Message</label>
                    <textarea
                        className="form-control"
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows="5"
                        placeholder="Votre message"
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Envoyer</button>
                {errorMessage && <div className="text-danger mt-2">{errorMessage}</div>}
                {successMessage && <div className="text-success mt-2">{successMessage}</div>}
            </form>
        </div>
    );
};

export default Contact;