import React, { useState, useEffect } from "react";
import { apiService } from "../../components/API/Api";
import { loadStripe } from '@stripe/stripe-js'; // Importer loadStripe
import "./payment.css";

const stripePromise = loadStripe('pk_test_51QFBXUKCe2DCFNsw7AdtEHll0dUAI8iacDaSZlYBqjeyTm6WF1ZOnyPiPMQvM594Pu0ZFZOd1mkso3yM95Aoyzwa00x5JYK6WH'); // Remplacez par votre clé publique Stripe

function Payment() {
    const [connexion, setConnexion] = useState(false);
    const [userConnected, setUserConnected] = useState({});
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [comment, setComment] = useState('');
    
    const [orderSummary, setOrderSummary] = useState({
        totalPrice: '',
        endDate: '',
        startDate: '',
        daysDifference: ''
    });

    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const getUserConnected = JSON.parse(localStorage.getItem("user"));
        const getSummaryOrder = JSON.parse(localStorage.getItem("orderSummary"));
        const getComment = localStorage.getItem('comment');

        if (getComment) {
            setComment(getComment);
        }

        if (getSummaryOrder) {
            setOrderSummary({
                totalPrice: getSummaryOrder.totalPrice,
                daysDifference: getSummaryOrder.daysDifference,
                startDate: getSummaryOrder.startDate,
                endDate: getSummaryOrder.endDate
            });
        }

        if (getUserConnected) {
            setUserConnected(getUserConnected);
            setEmail('');
            setPassword('');
        }

        const getCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
        const items = getCartItems.map(item => ({
            id: item.product.id,
            title: item.product.title,
            images: item.product.images,
            price: item.price,
            quantity: item.quantity,
            startDate: item.startDate,
            endDate: item.endDate
        }));
        setCartItems(items);
    }, []);

    const handleSubmitLogin = async (event) => {
        event.preventDefault();
        try {
            const response = await apiService.login(email, password);
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
            setUserConnected(response.user);
            setEmail('');
            setPassword('');
            window.dispatchEvent(new Event('storage'));
        } catch (error) {
            console.error(error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserConnected((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };


    const handlePayment = async (event) => {
        event.preventDefault();
        const order = {
            clientId: userConnected.id ? userConnected.id : null,
            firstname: userConnected.firstname,
            lastname: userConnected.lastname,
            email: userConnected.email,
            phone: userConnected.phone,
            address: userConnected.address,
            zipCode: userConnected.zip_code,
            city: userConnected.city,
            totalPrice: orderSummary.totalPrice,
            rentalDays: orderSummary.daysDifference,
            startDate: orderSummary.startDate,
            endDate: orderSummary.endDate,
            comment: comment ? comment : null,
            products: cartItems,
        };
    
        try {
            // Créer une session de paiement Stripe
            const response = await fetch('http://localhost:8000/api/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(order),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Erreur lors de la création de la session : ${JSON.stringify(errorData)}`);
            }
    
            const session = await response.json();
            const stripe = await stripePromise;
            
            // Rediriger vers Stripe Checkout
            const { error } = await stripe.redirectToCheckout({
                sessionId: session.id
            });
    
            if (error) {
                console.error("Erreur lors de la redirection vers Stripe Checkout :", error);
            }
        } catch (error) {
            console.error("Erreur lors du traitement du paiement :", error);
        }
    };
    
    

    return (
        <div>
            <h1 className="title-payment">Finaliser votre commande</h1>
            <div className="container-payment">
                <div className="container-login">
                    <h2>Connexion</h2>
                    <p>Soyez connecté à votre compte pour garder un historique de vos commandes</p>

                    {connexion ? (
                        <div className="container-form-connexion-payment">
                            <form onSubmit={handleSubmitLogin}>
                                <span onClick={() => setConnexion(false)} className="material-symbols-outlined">arrow_back_ios</span>
                                <input 
                                    onChange={(e) => setEmail(e.target.value)} 
                                    placeholder="Email" 
                                    name="email" 
                                    type="email" 
                                    value={email}
                                />
                                <input 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    placeholder="Mot de passe" 
                                    name="password" 
                                    type="password" 
                                    value={password}
                                />
                                <button type="submit">Connexion</button>
                            </form>
                        </div>
                    ) : (
                        <div className="container-button-connexion-payment">
                            <button onClick={() => setConnexion(true)}>Connexion</button>
                        </div>
                    )}
                </div>

                <div className="container-form-payment">
                    <h2 style={{ marginBottom: 50 }}>Information de livraison</h2>
                    <form onSubmit={handlePayment}>
                        <input 
                            type="text" 
                            name="firstname" 
                            value={userConnected.firstname || ""} 
                            required 
                            placeholder="Prénom" 
                            onChange={handleChange} 
                        />
                        <input 
                            type="text" 
                            name="lastname" 
                            value={userConnected.lastname || ""} 
                            required 
                            placeholder="Nom" 
                            onChange={handleChange} 
                        />
                        <input 
                            type="text" 
                            name="address" 
                            value={userConnected.address || ""} 
                            required 
                            placeholder="Adresse" 
                            onChange={handleChange} 
                        />
                        <input 
                            type="text" 
                            name="city" 
                            value={userConnected.city || ""} 
                            required 
                            placeholder="Ville" 
                            onChange={handleChange} 
                        />
                        <input 
                            type="text" 
                            name="zip_code" 
                            value={userConnected.zip_code || ""} 
                            required 
                            placeholder="Code postal" 
                            onChange={handleChange} 
                        />
                        <input 
                            type="text" 
                            name="email" 
                            value={userConnected.email || ""} 
                            required 
                            placeholder="Email" 
                            onChange={handleChange} 
                        />
                        <input 
                            type="text" 
                            name="phone" 
                            value={userConnected.phone || ""} 
                            required 
                            placeholder="Numéro" 
                            onChange={handleChange} 
                        />
                        <button type="submit">Payer</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Payment;
