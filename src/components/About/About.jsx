import React from 'react';
import AboutStage from "../../Assets/aboutstage.png"
import AboutDelivery from "../../Assets/aboutdelivery.png"
import AboutSav from "../../Assets/aboutsav.png"
import AboutPay from "../../Assets/aboutpay.png"
import AboutProduct from "../../Assets/aboutproduct.png"

import "./About.css"

const About = () => {
    return (
        <div>
            <div className="container-about">

                <div className="about-sujet">
                    <img src={AboutStage} alt="" />
                    <h3>Comment ça marche ?</h3>
                    <ul className='container-stage'>
                        <li><span className='text-bold'>Etape 1 :</span>Choisir le produit, définissez vos dates de location et ajoutez vos accessoires</li><br />
                        <li><span className='text-bold'>Etape 2 :</span>Recevoir le produit 48h avant le premier jour de location</li><br />
                        <li><span className='text-bold'>Etape 3 :</span>Retournez les produits sous 24h avec le carton et bon de retour fournis</li><br />
                    </ul>
                </div>

                <div className="about-sujet">
                    <img src={AboutDelivery} alt="" />
                    <h3>Livraison gratuite</h3>
                    <p>Pour faciliter votre expérience de location, la livraison est gratuite pour toute commande. Recevez votre équipement rapidement et sans frais supplémentaires. <br /><br />De plus, le retour est aussi offert grâce au bon que nous fournissons</p>
                </div>

                <div className="about-sujet">
                    <img src={AboutSav} alt="" />
                    <h3>Service client réactif</h3>
                    <p>Notre équipe dévouée est à votre disposition 7 jours sur 7 pour vous offrir un service client réactif et chaleureux. Que vous ayez besoin d'aide pour choisir le bon équipement, pour résoudre un problème technique ou pour toute autre demande, nous sommes là <br /><br />N'hésitez pas à nous contacter : <br /> contact@focaly.com</p>
                </div>

                <div className="about-sujet">
                    <img src={AboutPay} alt="" />
                    <h3>Paiement sécurisé</h3>
                    <p>Votre sécurité est notre priorité. Profitez de paiements 100% sécurisés pour vos locations de matériel de production. <br /><br />Vous pouvez louer notre matériel de production en toute confiance, sachant que vos informations personnelles et financières sont protégées de manière optimale</p>
                </div>

                <div className="about-sujet">
                    <img src={AboutProduct} alt="" />
                    <h3>Produits</h3>
                    <p>Chez Focaly, nous vous proposons uniquement des produits professionnels, de haute qualité et équipés des derniers modèles. <br /><br />Chaque produit que nous proposons est soigneusement inspecté et régulièrement mis à jour pour répondre aux exigences les plus élevées de nos clients.</p>
                </div>


            </div>
        </div>
    );
};

export default About;