import React, { useState } from 'react';
import './FAQ.css';

const FAQ = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    const faqs = [
        {
            question: "Comment puis-je louer du matériel sur votre site ?",
            answer: (
                <div>
                    Pour louer du matériel sur notre site, il vous suffit de sélectionner le produit que vous souhaitez, 
                    de choisir la durée de location qui correspond à vos besoins, et si vous le désirez, 
                    d'ajouter des options supplémentaires pour personnaliser votre expérience.
                    <br /><br />
                    Une fois ces étapes complétées, vous pourrez procéder au paiement de manière sécurisée, 
                    et le matériel sera réservé pour la période de location que vous avez choisie. 
                    C'est simple et pratique ! Notre équipe est là pour vous assister à chaque étape du processus 
                    si vous avez besoin d'aide ou de conseils.
                </div>
            ),
        },
        {
            question: "Quels modes de paiement acceptez-vous ?",
            answer: (
                <div>
                    Nous acceptons plusieurs modes de paiement :
                    <ul>
                        <li>Cartes de crédit et de débit : Visa, Mastercard, American Express et autres.</li>
                        <li>PayPal : Vous pouvez utiliser votre compte PayPal.</li>
                        <li>Apple Pay : Paiement rapide via Apple Pay.</li>
                    </ul>
                </div>
            ),
        },
        {
            question: "Quelle est la durée minimale de location ?",
            answer: "La durée minimale de location pour notre service est de 4 jours."
        },
        {
            question: "Est-il nécessaire d'inclure les délais de livraison dans la date de location ?",
            answer: "Non, nous livrons le matériel entre 24 et 72 heures avant la période de location."
        },
    ];

    const livraisonFaqs = [
        {
            question: "Quels sont les délais de livraison ?",
            answer: (
                <div>
                    Nous livrons entre 24 et 72 heures avant le début de votre location.
                </div>
            ),
        },
        {
            question: "Comment retourner le matériel à la fin de la période de location ?",
            answer: (
                <div>
                    Nos colis sont réutilisables et un bon de retour est inclus. Déposez-le dans un point relais avec l'emballage réutilisable.
                </div>
            ),
        },
        {
            question: "À quelle date dois-je retourner mon matériel ?",
            answer: (
                <div>
                    Vous devez retourner le matériel dans les 24 heures ouvrées suivant la fin de la location pour éviter les pénalités.
                </div>
            ),
        },
        {
            question: "Quels sont les frais de livraison et de retour du matériel ?",
            answer: (
                <div>
                    Les frais de livraison et de retour sont pris en charge par notre entreprise. Vous n'avez pas à vous soucier des coûts supplémentaires.
                </div>
            ),
        },
        {
            question: "Est-ce que la livraison en Belgique est possible ?",
            answer: (
                <div>
                    Oui, nous livrons en Belgique avec un service rapide et fiable.
                </div>
            ),
        },
        {
            question: "Est-il possible de modifier ou prolonger ma réservation après réception des équipements ?",
            answer: (
                <div>
                    Oui, vous pouvez modifier ou prolonger votre réservation en contactant notre service client.
                </div>
            ),
        },
    ];

    const toggleFAQ = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <div className="faq-container">
            <h1>Questions les plus courantes</h1>

            <h2>Achat</h2>
            <p>Toutes les questions concernant votre expérience d'achat.</p>
            <div className="faq-list">
                {faqs.map((faq, index) => (
                    <div key={index} className="faq-item">
                        <div 
                            className="faq-question" 
                            onClick={() => toggleFAQ(index)}
                        >
                            {faq.question}
                        </div>
                        <div 
                            className={`faq-answer ${activeIndex === index ? 'active' : ''}`}
                        >
                            {faq.answer}
                        </div>
                    </div>
                ))}
            </div>

            <h2>Livraison et retour</h2>
            <p>En savoir plus sur notre politique d'expédition et de retour.</p>
            <div className="faq-list">
                {livraisonFaqs.map((faq, index) => (
                    <div key={index} className="faq-item">
                        <div 
                            className="faq-question" 
                            onClick={() => toggleFAQ(index)}
                        >
                            {faq.question}
                        </div>
                        <div 
                            className={`faq-answer ${activeIndex === index ? 'active' : ''}`}
                        >
                            {faq.answer}
                        </div>
                    </div>
                ))}
            </div>

            <div className="customer-service">
                <h2>Service Client</h2>
                <p>
                    <i className="icon-customer-service" /> 
                    Notre service clientèle est disponible du lundi au dimanche de 8h à 20h30. 
                    Délai de réponse moyen : 12h.
                </p>

                <form className="contact-form">
                    <h3>Contactez-nous !</h3>
                    <label>
                        Email :
                        <input type="email" name="email" />
                    </label>
                    <label>
                        Nom :
                        <input type="text" name="name" />
                    </label>
                    <label>
                        Message :
                        <textarea name="message"></textarea>
                    </label>
                    <button type="submit" className="btn-envoyer">Envoyer</button>
                </form>
            </div>
        </div>
    );
};

export default FAQ;