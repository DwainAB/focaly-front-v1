import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { apiService } from "../../components/API/Api";
import { loadStripe } from "@stripe/stripe-js";
import { BadgeCheck, ShieldCheck } from 'lucide-react';
import "./SuccessPage.css";

function SuccessPage() {
    const [orderRef, setOrderRef] = useState("#");
    const [errorMessage, setErrorMessage] = useState("");
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [stripe, setStripe] = useState(null);
    const [idOrder, setIdOrder] = useState(null);
    const [isOrderVerified, setIsOrderVerified] = useState(false);
    const [refOrder, setRefOrder] = useState("");
    const [isInputDisabled, setIsInputDisabled] = useState(false);

    useEffect(() => {
        const hash = window.location.hash;
        const refOrderEncoded = hash.startsWith('#refOrder=') ? hash.split('=')[1] : null;
        
        if (refOrderEncoded) {
            const decodedRefOrder = decodeURIComponent(refOrderEncoded);
            setRefOrder(decodedRefOrder);
            setOrderRef(decodedRefOrder);
            setIsInputDisabled(true);

            apiService.getOrderByReference(decodedRefOrder)
                .then(response => {
                    if (response.message && response.message === "Commande non trouvée") {
                        setErrorMessage("La référence de commande est invalide ou introuvable.");
                    } else {
                        setIdOrder(response.id);
                        if (response.verify === false) {
                            setIsButtonDisabled(false);
                        } else {
                            setErrorMessage("Cette commande a déjà été vérifiée.");
                        }
                    }
                })
                .catch(error => {
                    setErrorMessage("Une erreur est survenue lors de la vérification de la commande.");
                });
        }
    }, []);

    useEffect(() => {
        localStorage.removeItem('cartItems');
        localStorage.removeItem('orderSummary');
        localStorage.removeItem('comment');

        const loadStripeInstance = async () => {
            const stripeInstance = await loadStripe('pk_test_51KtTuWGOv8pHQz3BLVWDm8uCUvyOPWl00UeL5ZD36txGonrHlmZaEELO4r9daxURXTghwiIWkstgp24aE8HbdnVS00wa34VPEJ');
            setStripe(stripeInstance);
        };
        
        loadStripeInstance();
    }, []);

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
                } else {
                    setErrorMessage("");

                    apiService.getOrderByReference(value)
                        .then(response => {
                            if (response.message && response.message === "Commande non trouvée") {
                                setErrorMessage("La référence de commande est invalide ou introuvable.");
                            } else {
                                setIdOrder(response.id);
                                if (response.verify === false) {
                                    setIsButtonDisabled(false);
                                } else {
                                    setErrorMessage("Cette commande a déjà été vérifiée.");
                                }
                            }
                        })
                        .catch(error => {
                            setErrorMessage("Une erreur est survenue lors de la vérification de la commande.");
                        });
                }
            }
        }
    };

    const handleIdentityVerification = async () => {
        try {
            const response = await apiService.createStripeIdentitySession(orderRef);
            if (response.clientSecret) {
                const result = await stripe.verifyIdentity(response.clientSecret);
                if (result.error) {
                    setErrorMessage(result.error.message);
                } else {
                    setIsOrderVerified(true);

                    if (idOrder) {
                        const updateData = { verify: true, status: "inPreparation" };
                        try {
                            await apiService.updateOrder(idOrder, updateData);
                        } catch (updateError) {
                            setErrorMessage("Une erreur est survenue lors de la mise à jour de la commande.");
                        }
                    } else {
                        setErrorMessage("Une erreur est survenue : référence de commande introuvable.");
                    }
                }
            }
        } catch (error) {
            setErrorMessage("Une erreur est survenue lors de la vérification d'identité.");
        }
    };

    return (
        <div className="container-success">
            <div className="card-success">
                {isOrderVerified ? (
                    <div>
                        <div className="success-icon">
                            <BadgeCheck />
                        </div>
                        <h1 className="title-success success-title">Commande validée !</h1>
                        <p className="subtitle-success">Merci de votre confiance.</p>
                        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                            <Link to="/" className="link-button">
                                Retour à l'accueil
                            </Link>
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
                                disabled={isInputDisabled}
                                placeholder="#LXXXX"
                            />
                            {errorMessage && (
                                <p className="error-message">{errorMessage}</p>
                            )}
                        </div>

                        <button
                            onClick={handleIdentityVerification}
                            disabled={isButtonDisabled}
                            className="button-success"
                        >
                            Valider mon identité
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SuccessPage;