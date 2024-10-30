import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

function CheckoutForm({ order }) {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsProcessing(true);

        // Créer le PaymentIntent en appelant l'API Symfony directement
        let clientSecret;
        try {
            const response = await fetch("http://localhost:8000/api/create-payment-intent", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ amount: order.totalPrice }),
            });
            const data = await response.json();

            if (data.error) {
                setError(data.error);
                setIsProcessing(false);
                return;
            }

            clientSecret = data.clientSecret;
        } catch (error) {
            setError("Erreur lors de la création du paiement.");
            setIsProcessing(false);
            return;
        }

        // Confirmer le paiement avec Stripe
        const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement),
                billing_details: {
                    email: order.email,
                    name: `${order.firstname} ${order.lastname}`,
                    address: {
                        line1: order.address,
                        city: order.city,
                        postal_code: order.zipCode,
                    },
                },
            },
        });

        setIsProcessing(false);

        if (result.error) {
            setError(result.error.message);
        } else {
            if (result.paymentIntent.status === "succeeded") {
                alert("Paiement réussi !");
                // Envoyer la commande au backend pour l'enregistrement
                try {
                    await fetch("/order", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(order),
                    });
                } catch (error) {
                    console.error("Erreur lors de l'envoi de la commande :", error);
                }
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <CardElement />
            {error && <div>{error}</div>}
            <button type="submit" disabled={!stripe || isProcessing}>
                {isProcessing ? "Processing..." : "Payer"}
            </button>
        </form>
    );
}

export default CheckoutForm;
