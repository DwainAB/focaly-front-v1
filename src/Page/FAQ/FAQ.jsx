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
                      <br></br>
                        <li>Cartes de crédit et de débit : Nous acceptons les paiements par Visa, Mastercard, American Express et autres principales cartes de crédit et de débit.</li><br></br>
                        <li>PayPal : Vous pouvez également utiliser votre compte PayPal pour régler votre location en toute simplicité et sécurité.</li><b></b>
                        <li>Apple Pay : Pour une expérience de paiement encore plus rapide et pratique, nous prenons en charge les paiements via Apple Pay.</li>
                    </ul>
                </div>
            ),
        },
        {
            question: "Quelle est la durée minimale de location ?",
            answer: "La durée minimale de location pour notre service est de 4 jours. Cette durée a été établie pour permettre aux clients de bénéficier pleinement de l'utilisation du matériel et de réaliser leurs projets de manière optimale."
        },
        {
            question: "Est-il nécessaire d'inclure les délais de livraison dans la date de location ?",
            answer: "Non, il n'est pas nécessaire d'inclure les délais de livraison dans les dates de location. Nous nous engageons à livrer le matériel entre 24 et 72 heures avant le début de votre location, afin que vous ayez le temps nécessaire pour vous préparer et utiliser l'équipement en toute tranquillité."
        },
        {
            question: "Comment puis-je savoir si le matériel que je souhaite louer est disponible ?",
            answer: "Si le matériel que vous souhaitez louer est disponible sur notre site, cela signifie qu'il est disponible à la location. Nous mettons à jour régulièrement notre inventaire pour refléter la disponibilité en temps réel. Ainsi, tant que le matériel apparaît sur notre site et qu'il peut être ajouté au panier, vous pouvez le réserver et être assuré de sa disponibilité pour la période souhaitée."
        },
        {
            question: "Est-ce que le matériel loué est couvert par une assurance ?",
            answer: "Oui, le matériel loué chez nous est couvert par une assurance. Nous accordons une grande importance à la sécurité et à la protection de nos clients et de leur équipement. Ainsi, chaque location inclut une assurance qui couvre le matériel contre un dysfonctionnement technique du produit n'entraînant pas le remplacement total de l'appareil."
        },
        {
            question: "Proposez-vous des réductions pour des locations à long terme ?",
            answer: "Absolument ! Nous proposons des réductions avantageuses pour les locations à long terme. Notre politique de tarification est automatiquement dégressive, ce qui signifie que plus vous louez longtemps, plus le prix de location quotidien diminue. Nous avons conçu cette approche pour récompenser nos clients fidèles et encourager les projets sur une durée prolongée."
        },
    ];

    const toggleFAQ = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <div className="faq-container">
            <h1>Questions les plus courantes</h1>
            <h2>Achat</h2>
            <p>Toutes les questions concernant votre expérience d'achat sur le magasin et le processus de paiement.</p>
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
        </div>
    );
};

export default FAQ;