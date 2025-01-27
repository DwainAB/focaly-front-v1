// SuccessPage.jsx
import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { apiService } from "../../components/API/Api";
import { loadStripe } from "@stripe/stripe-js";
import { BadgeCheck, ShieldCheck, AlertCircle } from 'lucide-react';
import "./SuccessPage.css";

function SuccessPage() {
    const [orderRef, setOrderRef] = useState("#");
    const [errorMessage, setErrorMessage] = useState("");
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [stripe, setStripe] = useState(null);
    const [idOrder, setIdOrder] = useState(null);
    const [isOrderVerified, setIsOrderVerified] = useState(false);
    const [verificationFailed, setVerificationFailed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [refOrder, setRefOrder] = useState("");
    const [isInputDisabled, setIsInputDisabled] = useState(false);

    // Debug logs
    useEffect(() => {
        console.log('État actuel:', {
            errorMessage,
            verificationFailed,
            isButtonDisabled,
            isOrderVerified,
            isLoading
        });
    }, [errorMessage, verificationFailed, isButtonDisabled, isOrderVerified, isLoading]);

    // Gestion du hash URL et initialisation de la commande
    useEffect(() => {
        const hash = window.location.hash;
        const refOrderEncoded = hash.startsWith('#refOrder=') ? hash.split('=')[1] : null;
        
        if (refOrderEncoded) {
            const decodedRefOrder = decodeURIComponent(refOrderEncoded);
            setRefOrder(decodedRefOrder);
            setOrderRef(decodedRefOrder);
            setIsInputDisabled(true);

            // Vérification de la commande
            verifyOrder(decodedRefOrder);
        }
    }, []);

    // Initialisation de Stripe et nettoyage du localStorage
    useEffect(() => {
        localStorage.removeItem('cartItems');
        localStorage.removeItem('orderSummary');
        localStorage.removeItem('comment');

        const loadStripeInstance = async () => {
            try {
                const stripeInstance = await loadStripe('pk_test_51KtTuWGOv8pHQz3BLVWDm8uCUvyOPWl00UeL5ZD36txGonrHlmZaEELO4r9daxURXTghwiIWkstgp24aE8HbdnVS00wa34VPEJ');
                setStripe(stripeInstance);
            } catch (error) {
                console.error("Erreur lors de l'initialisation de Stripe:", error);
                setErrorMessage("Impossible d'initialiser le système de paiement.");
            }
        };
        
        loadStripeInstance();
    }, []);

    // Fonction de vérification de la commande
    const verifyOrder = async (orderReference) => {
        try {
            let cleanedOrderRef = orderReference.replace('#', ''); // Supprime le # si présent

            const response = await apiService.getOrderByReference(cleanedOrderRef);
            
            if (response.message && response.message === "Commande non trouvée") {
                setErrorMessage("La référence de commande est invalide ou introuvable.");
                setIsButtonDisabled(true);
            } else {
                setIdOrder(response.id);
                if (response.verify === false) {
                    setIsButtonDisabled(false);
                } else {
                    setErrorMessage("Cette commande a déjà été vérifiée.");
                    setIsButtonDisabled(true);
                }
            }
        } catch (error) {
            console.error("Erreur lors de la vérification de la commande:", error);
            setErrorMessage("Une erreur est survenue lors de la vérification de la commande.");
            setIsButtonDisabled(true);
        }
    };

    // Gestion du changement de la référence commande
    const handleChange = (e) => {
        const value = e.target.value.toUpperCase();
        
        if (value.length <= 6) {
            if (value.length === 0 || value[0] !== '#') {
                setOrderRef("#" + value);  
            } else {
                setOrderRef(value);
            }

            if (value.length === 6) {
                const regex = /^#[A-Z]\d{4}$/;  
                if (!regex.test(value)) {
                    setErrorMessage("Le format doit être #LXXXX (L = lettre, X = chiffre)");
                    setIsButtonDisabled(true);
                } else {
                    setErrorMessage("");
                    verifyOrder(value);
                }
            } else {
                setIsButtonDisabled(true);
            }
        }
    };

    const handleIdentityVerification = async () => {
        setIsLoading(true);
        setIsButtonDisabled(true);
        
        try {
            // 1. Création de la session Stripe
            let cleanedOrderRef = orderRef.replace('#', ''); // Supprime le # si présent

            // Ensuite, vous envoyez la requête sans le #
            const response = await apiService.createStripeIdentitySession(cleanedOrderRef);
            console.log('Response initiale:', response);
    
            if (!response.clientSecret) {
                throw new Error("Impossible d'initialiser la session de vérification");
            }
    
            // 2. Vérification d'identité avec Stripe
            await stripe.verifyIdentity(response.clientSecret);
            
            // 3. Une fois que stripe.verifyIdentity est terminé, on vérifie la réponse du webhook
            const webhookResponse = await apiService.checkVerificationStatus(cleanedOrderRef);
            console.log('Réponse webhook:', webhookResponse);
    
            // 4. Traitement de la réponse du webhook
            if (webhookResponse.status === 'verified') {
                setIsOrderVerified(true);
                setVerificationFailed(false);
                setErrorMessage("");
                
                // Mettre à jour le statut de la commande si nécessaire
                if (idOrder) {
                    await apiService.updateOrder(idOrder, {
                        verify: true,
                        status: "waiting_start_date"
                    });
                }
            } else {
                setVerificationFailed(true);
                setIsOrderVerified(false);
                setErrorMessage(webhookResponse.message || "La vérification a échoué");
            }
    
        } catch (error) {
            console.error("Erreur processus de vérification:", error);
            setErrorMessage(error.message || "Une erreur est survenue lors de la vérification d'identité.");
            setVerificationFailed(true);
            setIsOrderVerified(false);
        } finally {
            setIsLoading(false);
            setIsButtonDisabled(false);
        }
    };

    
    // Fonction de réinitialisation de la vérification
    const handleRetry = () => {
        // Réinitialisation complète des états
        setVerificationFailed(false);
        setErrorMessage("");
        setIsButtonDisabled(false);
        setIsLoading(false);
        setIsOrderVerified(false);
        
        // Revérifier la commande
        if (orderRef) {
            verifyOrder(orderRef);
        }
    };

    return (
        <div className="container-success">
            <div className="card-success">
                {isOrderVerified ? (
                    <div>
                        <div className="success-icon">
                            <BadgeCheck className="w-12 h-12 text-green-500" />
                        </div>
                        <h1 className="title-success success-title">Commande validée !</h1>
                        <p className="subtitle-success">Merci de votre confiance.</p>
                        <div className="text-center mt-8">
                            <Link to="/" className="link-button">
                                Retour à l'accueil
                            </Link>
                        </div>
                    </div>
                ) : verificationFailed ? (
                    <div>
                        <div className="error-container">
                            <div className="error-icon">
                                <AlertCircle className="w-12 h-12 text-red-500" />
                            </div>
                            <h2 className="error-title">Échec de la vérification</h2>
                            <p className="error-message">{errorMessage}</p>
                            <p className="error-help">
                                Vous pouvez réessayer la vérification ou contacter notre support si le problème persiste.
                            </p>
                            <button
                                onClick={handleRetry}
                                className="button-success mt-6"
                            >
                                Réessayer la vérification
                            </button>
                        </div>
                    </div>
                ) : (
                    <div>
                        <h1 className="title-success">Finalisation de votre commande</h1>
                        <p className="subtitle-success">
                            Pour valider votre commande, veuillez renseigner votre numéro de commande reçu par email
                        </p>

                        <div className="verify-badge">
                            <ShieldCheck />
                            <span>Vérification d'identité requise</span>
                        </div>

                        <div className="info-alert">
                            <p>
                                Si vous ne pouvez pas vérifier votre identité maintenant, utilisez le lien reçu par email pour revenir sur cette page plus tard.
                            </p>
                        </div>

                        <div className="form-group">
                            <label htmlFor="orderRef" className="form-label">
                                Numéro de commande
                            </label>
                            <input
                                type="text"
                                id="orderRef"
                                className="input-success"
                                value={orderRef}
                                onChange={handleChange}
                                disabled={isInputDisabled || isLoading}
                                placeholder="#LXXXX"
                            />
                            {errorMessage && !verificationFailed && (
                                <p className="error-message">{errorMessage}</p>
                            )}
                        </div>

                        <button
                            onClick={handleIdentityVerification}
                            disabled={isButtonDisabled || isLoading}
                            className="button-success"
                        >
                            {isLoading ? 'Vérification en cours...' : 'Valider mon identité'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SuccessPage;